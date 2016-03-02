var path = require('path')
var fs = require('fs')
var gulp = require('gulp')
var rimraf = require('rimraf')

var webpack = require('webpack')
var gutil = require("gulp-util")
var gulpWebpack = require('webpack-stream')

var WebpackDevServer = require("webpack-dev-server")
var SplitByNamePlugin = require('split-by-name-webpack-plugin')
var argv = require('yargs').argv;

var uB_wConfig = require("../../webpack.config.js").webpackConfig

var uB_prodKeys = require("../../webpack.config.js").production
var uB_devKeys = require("../../webpack.config.js").development

var stream = require('webpack-stream')
var makeConfig = require('../makeConfig')
var merge = require('webpack-merge')

var setupRelease = require('../setup').setupRelease
var makeManifestPath = require('../utils').makeManifestPath

module.exports = function (options) {

	gulp.task('clean', function(){
		var dir = options.dir
		rimraf(dir.release, function(error){});
		rimraf(dir.development, function(error){});
		rimraf(makeManifestPath(dir.manifest.versions), function(error){});
		rimraf(makeManifestPath(dir.manifest.development), function(error){});
	})

	var wpConfigDevelopment = makeConfig(options, uB_wConfig, uB_devKeys, uB_prodKeys)
	var wpConfigProduction = makeConfig(options, uB_wConfig, uB_prodKeys, uB_devKeys)

	gulp.task('release', ['webpack-p'], function(callback) {
		setupRelease(options, argv.production).then(function(newVersion){})
	})

	gulp.task('webpack-p', function () {
		return gulp.src(options.entry)
			.pipe(gulpWebpack(wpConfigProduction, webpack))
			.pipe(gulp.dest(path.resolve(options.dir.development)));
	})

	gulp.task('webpack-d', function () {
		var newDevVersion = setupRelease(options, false)
		return gulp.src(options.entry)
			.pipe(gulpWebpack(wpConfigDevelopment, webpack))
			.pipe(gulp.dest(path.resolve(options.dir.development)));
	})

	//gulp.task('webpack', [], function () {
	//	return gulp.src(options.dir.modules.list) // gulp looks for all source files under specified path
	//		//.pipe(sourcemaps.init()) // creates a source map which would be very helpful for debugging by maintaining the actual source code structure
	//		.pipe(stream(wpConfigDevelopment)) // blend in the webpack config into the source files
	//		//.pipe(uglify())// minifies the code for better compression
	//		//.pipe(sourcemaps.write())
	//		.pipe(gulp.dest(options.dir.dist));
	//});

	gulp.task("webpack-dev-server", function (callback) {

		options.split = false;

		var wConfig = makeConfig(options, uB_wConfig, uB_devKeys, uB_prodKeys)

		console.log("wConfig", wConfig)
		wConfig.split = false; // No splitting if dev-server
		wConfig.devtool = "eval";
		wConfig.debug = true;

		//wConfig.entry.unshift('webpack-dev-server/client?http://localhost:8080')

		// Start a webpack-dev-server
		new WebpackDevServer(webpack(wConfig), {
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

		}).listen(8080, "localhost", function (err) {
			if (err) throw new gutil.PluginError("webpack-dev-server", err);
			gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
		});
	});

	gulp.task('default', ['webpack-dev-server']);
	//gulp.task('default', ['webpack-dev-server', 'watch']);
	//
	//gulp.task('watch', function () {
	//	gulp.watch(path.resolve(options.dir.src.es6), ['webpack']);
	//});
}
