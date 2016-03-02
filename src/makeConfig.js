var path = require('path')
var merge = require('webpack-merge')

var Config = require('webpack-configurator')

var SplitByPathPlugin = require('webpack-split-by-path')

module.exports = function(options, uB_wConfig, keepkeys, removeKeys) {

	var config = new Config();

	var uB_extend = uB_wConfig[keepkeys[0]]

	var user_wConfig = options.webpackConfig
	var user_extend = user_wConfig[keepkeys[0]]

	config.merge(uB_wConfig)
	config.merge(uB_extend)
	config.merge(user_wConfig)
	config.merge(user_extend)

	var wpConfig = config.resolve()

	delete wpConfig.PRODUCTION
	delete wpConfig.DEVELOPMENT

	//var wpConfig = merge.smart(uB_config, user_wConfig)

	var dir = options.dir

	wpConfig.output.path = path.resolve(wpConfig.output.path)
	wpConfig.output.publicPath = path.resolve(wpConfig.output.publicPath)
	//config.devServer.contentBase= path.resolve(config.devServer.contentBase)

	if (options.split) {
		//console.log("Splitting bundle", path.join(dir.root, dir.src.es6, 'app/'))
		wpConfig = merge(wpConfig, {
			plugins: [
				new SplitByPathPlugin(
					options.modules.list.es6.map(function(module){
						return {
							name: module,
							path: path.join(dir.root, dir.src.es6, module + '/')
						}
					})
					, {
						ignore: [
							//'path/to/ingore/file/or/dir1',
							//'path/to/ingore/file/or/dir2'
						]
					}
				)
			]
		})

		//console.log("PL", config.plugins)
	}

	// By name

	//if (options.split) {
	//	console.log("Splitting bundle")
	//	var plugins = [
	//		new SplitByNamePlugin({
	//			buckets: [
	//				{
	//					name: 'app',
	//					regex: /app\//
	//				},
	//				{
	//					name: 'moduleA',
	//					regex: /moduleA\//
	//				},
	//				{
	//					name: 'moduleB',
	//					regex: /moduleB\//
	//				},
	//				{
	//					name: 'lib',
	//					regex: /lib\//
	//				}
	//			]
	//		})
	//	]
	//	config = merge(config, plugins)
	//}


	return wpConfig
}
