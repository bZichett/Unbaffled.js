var path = require('path')
var gulp = require('gulp')

var webpack = require('webpack')
var gutil = require("gulp-util");
var gulpWebpack = require('webpack-stream');

var WebpackDevServer = require("webpack-dev-server");
var SplitByPathPlugin = require('webpack-split-by-path');
var SplitByNamePlugin = require('webpack-split-by-path');
var unbaffledDef = require("../../webpack/webpack.default.config.js").webpackConfig;
var unbaffledProd = require("../../webpack/webpack.production.config.js");
var unbaffledDev = require("../../webpack/webpack.development.config.js");

var merge = require('webpack-merge')

var config = require('../../webpack/webpack.default.config').config

var stream = require('webpack-stream');

module.exports = function (options) {

	var configs = makeConfigs(options)
	var wpConfigProduction = configs[0]
	var wpConfigDevelopment = configs[1]

	console.log("PLUGINS", wpConfigDevelopment.plugins)
	console.log("PLUGINS", wpConfigProduction.plugins)

	var moduleDirList = options.dir.modules.list

	gulp.task('webpack-p', function () {
		//console.log(wpConfigProduction)
		return gulp.src(options.entryPoints)
			.pipe(gulpWebpack(wpConfigProduction, webpack))
			.pipe(gulp.dest(options.dir.release));
	})

	gulp.task('webpack-d', function () {
		return gulp.src(options.entryPoints)
			.pipe(gulpWebpack(wpConfigDevelopment, webpack))
			.pipe(gulp.dest(options.dir.development));
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

		//var wConfig = Object.create(wpConfigDevelopment);
		var wConfig = wpConfigDevelopment

		wConfig.devtool = "eval";
		wConfig.debug = true;

		//console.log("config: ", wConfig)
		//console.log("Watching: ", options.dir.modules.list)
		//console.log("output.path:", path.resolve("publicPath: ", wConfig.output.publicPath))

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
			//filename: "bundle.js",
			watchOptions: {
				aggregateTimeout: 300,
				poll: 1000
			},
			//headers: { "X-Custom-Header": "yes" }

		}).listen(8080, "localhost", function (err) {
			if (err) throw new gutil.PluginError("webpack-dev-server", err);
			gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
		});
	});

	gulp.task('watch', function () {
		gulp.watch(DIR.ALL, ['webpack']);
	});

	gulp.task('default', ['webpack-dev-server', 'watch']);


// WEBPACK

//var mocha = require('gulp-mocha')
//var webpack = require( 'webpack')
//var wpConfig = require( './webpack.config.babel')
//var WebpackDevServer = require('webpack-dev-server')
//gulp.task('default', ['webpack']);
//gulp.task('babel', function() {
//    return gulp.src('src/*.js')
//        .pipe(babel())
//        .pipe(gulp.dest('target'));
//});
//
//
//gulp.task('webpack', ['test'], function(callback) {
//    var myConfig = Object.create(wpConfig);
//    myConfig.plugins = [
//        new webpack.optimize.DedupePlugin(),
//        new webpack.optimize.UglifyJsPlugin()
//    ];
//
//    // run webpack
//    webpack(myConfig, function(err, stats) {
//        if (err) throw new gutil.PluginError('webpack', err);
//        gutil.log('[webpack]', stats.toString({
//            colors: true,
//            progress: true
//        }));
//        callback();
//    });
//});
//
//gulp.task('server', ['webpack'], function(callback) {
//    // modify some webpack config options
//    var myConfig = Object.create(wpConfig);
//    myConfig.devtool = 'eval';
//    myConfig.debug = true;
//
//    // Start a webpack-dev-server
//    new WebpackDevServer(webpack(myConfig), {
//        publicPath: '/' + myConfig.output.publicPath,
//        stats: {
//            colors: true
//        },
//        hot: true
//    }).listen(8080, 'localhost', function(err) {
//        if(err) throw new gutil.PluginError('webpack-dev-server', err);
//        gutil.log('[webpack-dev-server]', 'http://localhost:8080/webpack-dev-server/index.html');
//    });
//});
}

function makeConfigs(options) {

	var userConfigs = options.webpack.config

	var userDef = userConfigs.default
	var userProd = userConfigs.production
	var userDev = userConfigs.development

	userProd = merge(userDef, userProd)
	userDev = merge(userDef, userDev)

	var wpConfigProduction = merge(
		merge(unbaffledDef, unbaffledProd())
		, userProd);

	var wpConfigDevelopment = merge(
		merge(unbaffledDef, unbaffledDev)
		, userDev);

	var configs = [wpConfigDevelopment, wpConfigProduction]

	var dir = options.dir

	for (var i = 0; i < configs.length; i++) {
		var config = configs[i]
		config.output.path = path.resolve(config.output.path)
		config.output.publicPath = path.resolve(config.output.publicPath)
		//config.devServer.contentBase= path.resolve(config.devServer.contentBase)

		if (options.split) {
			//console.log("Splitting bundle", path.join(dir.root, dir.src.es6, 'app/'))
			//configs[i] = merge(config, {
			//	plugins: [
			//		new SplitByPathPlugin(
			//			options.modules.list.es6.map(function(module){
			//				return {
			//					name: module,
			//					path: path.join(dir.root, dir.src.es6, module + '/')
			//				}
			//			})
			//		, {
			//				ignore: [
			//					//'path/to/ingore/file/or/dir1',
			//					//'path/to/ingore/file/or/dir2'
			//				]
			//			}
			//		)
			//	]
			//})
			//
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

	}

	return configs
}