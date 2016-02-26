var gulp = require('gulp')
var mocha = require('gulp-mocha')
var webpack = require('gulp-webpack')

gulp.task('watch', function(){
    return gulp.watch(['test/**/*-test.js'], ['test']);
})


gulp.task('test', function(){
    return gulp.src('test/*-test.js')
        .pipe(mocha({
            reporter: 'spec'
        }));
})

gulp.task('webpack', function(){
    return webpack(
            require('./webpack.production.config.js').webpackConfig
        )
        .pipe(gulp.dest('./build/'));
})

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