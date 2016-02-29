/* global require */

/** NODE */
var path = require('path');

/** GULP TOOLS */
var gulp = require('gulp')
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var sass = require("gulp-ruby-sass");
var mocha = require("gulp-mocha")
var merge = require("webpack-merge")

/** SCAFFOLD */

var gulpfile = require('./src/gulpfile')

var tasks = [
	//require('./src/gulpfile'),
	require('./src/tasks/webpack'),
	require('./src/tasks/scss'),
	require('./src/tasks/test'),
	require('./src/tasks/es6')
]

module.exports = function (options) {

	options = options || {};

	options.entryPoints = options.entryPoints || false
	if (!options.entryPoints) throw Error('Need to specify at least one entry point');

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

	console.log("Options", options)

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