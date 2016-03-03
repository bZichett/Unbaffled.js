var path = require('path')
var Config = require('webpack-configurator')
var merge = require('webpack-merge')
var webpack = require('webpack')
var SplitByPathPlugin = require('webpack-split-by-path')

module.exports = function(options, uB_wConfig, keyRegulator) {

	var dir = options.dir

	var config = new Config();

	var uB_extend = uB_wConfig[keyRegulator.unbaffled.keep[0]]
	var user_wConfig = options.webpackConfig
	var user_extend = user_wConfig[keyRegulator.user.keep[0]]

	var jsKeys = options.modules.namespaced.js

	// 4 merges which create a final config based on production and development keys
	// in the 2 supplied webpackConfigs (user generated and unbaffled)
	config.merge(uB_wConfig)
	config.merge(uB_extend)
	config.merge(user_wConfig)
	config.merge(user_extend)

	// Moved to index.js due to a glitch : config.merge(overrideOptions)

	config.merge({
		provide: options.provide,
		plugins: [
			 new webpack.ProvidePlugin(
				options.webpackConfig.externals
			),

			// User definitions
			new webpack.DefinePlugin(options.define ? options.define : {}),
		],
		resolve: {
			modules: jsKeys.map(function(moduleName){
				return path.resolve(dir.root, dir.src.js, moduleName)
			})
		}
	})

	if (options.split) {
		config.merge({
			plugins: [
				new SplitByPathPlugin(
					jsKeys.map(function(module){
						return {
							// Flatten the hierarchy (moduleA instead of module/moduleA)
							name: path.parse(module).name,
							path: path.join(dir.root, dir.src.js, module + '/')
						}
					})
					, {
						ignore: [
						]
					}
				)
			]
		})
	}

	var webpackConfig = config.resolve()

	webpackConfig.output.path = dir.root + '/' + webpackConfig.output.path
	webpackConfig.output.publicPath = dir.root + '/' + webpackConfig.output.publicPath

	delete webpackConfig[keyRegulator.unbaffled.keep[0]]
	delete webpackConfig[keyRegulator.unbaffled.remove[0]]

	return webpackConfig
}
