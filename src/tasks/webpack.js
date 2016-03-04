
/** Directory and files */
var rimraf = require('rimraf')
var path = require('path')
var fs = require('fs')

/** Misc */
var argv = require('yargs').argv;

/** Gulp */
var gulp = require('gulp')
var gulpWebpack = require('webpack-stream')
var gutil = require("gulp-util")

/** Webpack */
var webpack = require('webpack')
var WebpackDevServer = require("webpack-dev-server")

/** Configurations */
var uB_wConfig = require("../../webpack.config.js").webpackConfig
var uB_prodKeys = require("../../webpack.config.js").production
var uB_devKeys = require("../../webpack.config.js").development

/** Unbaffled */
var makeConfig = require('../makeConfig')
var setupRelease = require('../setup').setupRelease
var Config = require('webpack-configurator')

function doneWithRelease(version){
	if(version.noChanges){
		gutil.log(gutil.colors.red("No changes; delete the directory"))
	} else {
		gutil.log(gutil.colors.magenta("Built " + version.name))
		gutil.log(gutil.colors.magenta("Modules updated " + version.updatedModules))
	}
}

module.exports = function (options) {

	var prodKeys = { unbaffled: { keep: uB_prodKeys,                 remove: uB_devKeys},
					 user:      { keep: options.keys.production,    remove: options.keys.development}}

	var devKeys = { unbaffled: { keep: uB_prodKeys,                 remove: uB_devKeys},
					user:      { keep: options.keys.production,    remove: options.keys.development}}

	gulp.task('default', ['webpack-dev-server']);

	gulp.task('release-p', ['webpack-p'], function() {
		setupRelease(options, true).then(function(newVersion){
			doneWithRelease(newVersion)
		})
	})
	gulp.task('release-d', ['webpack-d'], function() {
		setupRelease(options, false).then(function(newVersion){
			doneWithRelease(newVersion)
		})
	})

	gulp.task('webpack-p', function () {

		var wpConfigProduction = makeConfig(options, uB_wConfig, prodKeys)

		console.log(wpConfigProduction)

		// TODO Fix the key here to allow multiple entry points
		return gulp.src(options.webpackConfig.entry['app'])
			.pipe(gulpWebpack(wpConfigProduction, webpack))
			.pipe(gulp.dest(path.resolve(options.dir.development)));
	})

	gulp.task('webpack-d', function () {

		var wpConfigDevelopment = makeConfig(options, uB_wConfig, devKeys)

		return gulp.src(options.webpackConfig.entry['app'])
			.pipe(gulpWebpack(wpConfigDevelopment, webpack))
			.pipe(gulp.dest(path.resolve(options.dir.development)));
	})

	gulp.task("webpack-dev-server", function () {

		options.split = false;

		var wConfig = makeConfig(options, uB_wConfig, devKeys)

		console.log("webpackConfig", wConfig)

		wConfig.split = false; // No splitting if dev-server
		wConfig.devtool = "eval";
		wConfig.debug = true;

		//wConfig.entry.unshift('webpack-dev-server/client?http://localhost:8080')
		var webpackDevServerConfig = new Config()

		webpackDevServerConfig.merge({
			//publicPath: path.resolve(wConfig.output.publicPath),
			contentBase: path.resolve(wConfig.output.path),
			stats: {
				colors: true
			},
			//hot: true
			// Set this if you want webpack-dev-server to delegate a single path to an arbitrary server.
			// Use "*" to proxy all paths to the specified server.
			// This is useful if you want to get rid of 'http://localhost:8080/' in script[src],
			// and has many other use cases (see https://github.com/webpack/webpack-dev-server/pull/127 ).
			//proxy: {
			//    "*": "http://localhost:8000"
			//},
			// webpack-dev-middleware options
			quiet: false,
			noInfo: false,
			//lazy: true,
			filename: "bundle.js",
			watchOptions: {
				aggregateTimeout: 300,
				poll: 1000
			}
			//headers: { "X-Custom-Header": "yes" }

		})
		webpackDevServerConfig.merge(wConfig.devServer ? wConfig.devServer : {})

		new WebpackDevServer(webpack(wConfig), webpackDevServerConfig.resolve())
			.listen(8080, "localhost", function (err) {
				if (err) throw new gutil.PluginError("webpack-dev-server", err);
				gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
		});
	});

}

module.exports.getProductionWebpackConfig = function(options){
	var prodKeys = { unbaffled: { keep: uB_prodKeys,                 remove: uB_devKeys},
		user:      { keep: options.keys.production,    remove: options.keys.development}}
	return makeConfig(options, uB_wConfig, prodKeys)
}

module.exports.getDevelopmentWebpackConfig = function(options){
	var devKeys = { unbaffled: { keep: uB_prodKeys,                 remove: uB_devKeys},
		user:      { keep: options.keys.production,    remove: options.keys.development}}
	return makeConfig(options, uB_wConfig, devKeys)
}