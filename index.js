/** NODE */
var path = require('path');

var merge = require('webpack-merge')

var getProductionWebpackConfig =  require('./src/tasks/webpack').getProductionWebpackConfig
var getDevelopmentWebpackConfig = require('./src/tasks/webpack').getProductionWebpackConfig

/** SCAFFOLD */

// These will be registered in the global namespace
var tasks = [
	require('./src/tasks/webpack'),
	require('./src/tasks/utils'),
]

module.exports = function (options) {

	options = options || {};

	if (!options.modules) throw Error('Need to specify at least one module');
	if (!options.webpackConfig) throw Error('Need to specify a webpackConfig');

	var jsModules = options.modules.js
	var jsKeys = Object.keys(jsModules)
	var normalizedJsKeys = jsKeys.map(function(moduleName){
		if(moduleName.indexOf('/') != -1){
			return moduleName.split('/')[1] // TODO only will work for 1 level deep
		} else return moduleName
	})

	var dir = options.dir

	merge(options, {
		modules: {
			namespaced: {
				js: jsKeys
			},
			list: {
				js: normalizedJsKeys
			}
		},
		dir: {
			modules: {
				list: jsKeys.map(function (name) {
					return path.resolve(dir.languages.js, name)
				})
			},
			dist: path.join(dir.root, dir.dist),
			release: path.join(dir.root, dir.dist, dir.release),
			development: path.join(dir.root, dir.dist, dir.development)
		}
	})

	for (var i = 0; i < tasks.length; i++) {
		tasks[i](options)
	}

	return {
		options: options,
		productionWebpackConfig: getProductionWebpackConfig(options),
		developmentWebpackConfig: getDevelopmentWebpackConfig(options)
	}
};