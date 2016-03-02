/** NODE */
var path = require('path');
var merge = require("webpack-merge")

/** SCAFFOLD */

// These will be registered in the global namespace
var tasks = [
	require('./src/tasks/webpack'),
]

module.exports = function (options) {

	options = options || {};

	if (!options.modules) throw Error('Need to specify at least one module');

	options.versionsDir = options.versionsDir || '/dist';

	var dir = options.dir
	var es6Modules = options.modules.language.es6

	var es6_list = Object.keys(es6Modules)

	options = merge(options, {
		modules: {
			list: {
				es6: es6_list
			}
		},
		dir: {
			modules: {
				list: es6_list.map(function (name) {
					return path.resolve(dir.languages.es6, name)
				})
			},
			dist: path.join(dir.root, dir.dist),
			release: path.join(dir.root, dir.dist, dir.release),
			development: path.join(dir.root, dir.dist, dir.development)
		}
	})

	var globs = {
		tests: ['test/*-test.js'].concat(
			Object.keys(es6Modules).map(function (moduleName) {
				return es6Modules[moduleName][0]
			}))
	}

	for (var i = 0; i < tasks.length; i++) {
		tasks[i](options)
	}

	return options
};