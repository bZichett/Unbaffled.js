var path = require('path')
var gulp = require('gulp')
var mocha = require('gulp-mocha')

var webpack = require('webpack')
//var webpack = require('gulp-webpack')

var gutil = require("gulp-util");
var WebpackDevServer = require("webpack-dev-server");
//var webpackConfig = require("./webpack/webpack.production.config.js").webpackConfig;
var webpackConfig = require("./webpack/webpack.development.config.js").webpackConfig;
var stream = require('webpack-stream');

var DIR = {
    //HTML: 'src/index.html',
    ALL: ['example/**/*.js'],
    MINIFIED_OUT: 'build.min.js',
    DEST_SRC: './dist/src',
    DEST_BUILD: './dist/build',
    DEST: './dist'
};

gulp.task('watch', function(){
    return gulp.watch(['test/**/*-test.js'], ['test']);
})


gulp.task('test', function(){
    return gulp.src('test/*-test.js')
        .pipe(mocha({
            reporter: 'spec'
        }));
})

gulp.task('webpack-p', function(){
    return webpack(
            require('./webpack/webpack.production.config.js').webpackConfig
        )
        .pipe(gulp.dest('./build/versions'));
})

gulp.task('webpack-d', function(){
    return webpack(
            require('./webpack/webpack.development.config.js').webpackConfig
        )
        .pipe(gulp.dest('./build/development'));
})

gulp.task('webpack', [], function() {
    return gulp.src(DIR.ALL) // gulp looks for all source files under specified path
        //.pipe(sourcemaps.init()) // creates a source map which would be very helpful for debugging by maintaining the actual source code structure
        .pipe(stream(webpackConfig)) // blend in the webpack config into the source files
        //.pipe(uglify())// minifies the code for better compression
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest(DIR.DEST_BUILD));
});

gulp.task("webpack-dev-server", function(callback) {

    var wConfig = Object.create(webpackConfig);
    wConfig.devtool = "eval";
    wConfig.debug = true;

    // Start a webpack-dev-server
    new WebpackDevServer(webpack(wConfig), {
        publicPath: wConfig.output.publicPath,
        contentBase: wConfig.output.path,
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

    }).listen(8080, "localhost", function(err) {
        if (err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8080/webpack-dev-server/index.html");
    });
});

gulp.task('watch', function() {
    gulp.watch(DIR.ALL, ['webpack']);
});

gulp.task('default', ['webpack-dev-server', 'watch']);

//var webdriver = require('gulp-webdriver');

//var selenium = require('selenium-standalone');
//var connect = require('connect')
//var serveStatic = require('serve-static')
//var http = require('http')
//
//var seleniumServer, httpServer
//
//gulp.task('http', function () {
//	var server = connect().use(serveStatic('test/fixtures'));
//	httpServer = http.createServer(server).listen(9000, done);
//});
//
//gulp.task('selenium', function(done){
//	selenium.install({logger: console.log}, function(){
//		selenium.start(function(err, child){
//			if (err) { return done(err); }
//			seleniumServer = child;
//			done();
//		})
//	});
//});
//
//gulp.task('e2e', ['http', 'selenium'], function(){
//	return gulp.src(ROOT + 'wdio.conf.js')
//		.pipe(webdriver()).on('error', function() {
//			seleniumServer.kill();
//			process.exit(1);
//		})
//});
//
//gulp.task('test', ['e2e'], () => {
//	httpServer.close();
//	seleniumServer.kill();
//});




// WEBPACK

//var mocha = require('gulp-mocha')
//var gutil = require( 'gulp-util')
//var webpack = require( 'webpack')
//var webpackConfig = require( './webpack.config.babel')
//var WebpackDevServer = require('webpack-dev-server')
//gulp.task('default', ['webpack']);
//gulp.task('babel', function() {
//    return gulp.src('src/*.js')
//        .pipe(babel())
//        .pipe(gulp.dest('target'));
//});
//
//gulp.task('test', ['babel'], function(){
//    //return gulp.src('test/*.js')
//    //	.pipe(mocha())
//    //	.on('error', () => {
//    //		gulp.emit('end');
//    //	});
//});
//
//gulp.task('watch-test', function(){
//    return gulp.watch(['src/**', 'test/**'], ['test']);
//});
//
//gulp.task('webpack', ['test'], function(callback) {
//    var myConfig = Object.create(webpackConfig);
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
//    var myConfig = Object.create(webpackConfig);
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
//
//gulp.task('deployDev', function(){
//    gulp.shell('rhc scp upload ...')
//})
//
//gulp.task('deployRelease', function(){
//    gulp.shell('rhc scp upload ...')
//})