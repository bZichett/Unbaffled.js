/** NODE */
var path = require('path');

/** GULP TOOLS */
var gulp = require('gulp')
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var sass = require("gulp-ruby-sass");
var mocha = require("gulp-mocha")

/** SCAFFOLD */
var setupRelease = require("./src/setup").setupRelease

module.exports = function(options) {

    options = options || {};

    options.entryPoints = options.entryPoints || false
    if(!options.entryPoints) throw Error('Need to specify at least one entry point');

    if(!options.modules) throw Error('Need to specify at least one module');

    options.versionsDir = options.versionsDir || '/dist';

    var es6Modules = options.modules.language.es6

    options.modules.list = {
        es6 : Object.keys(es6Modules)
    }

    var dir = options.dir

    dir.dist = path.resolve(dir.dist)

    var globs = {
        tests: ['test/*-test.js'].concat(
            Object.keys(es6Modules).map(function(moduleName){return es6Modules[moduleName][0]}))

    }

    gulp.task('default', function(){
        setupRelease(options)
    })


    gulp.task('test', function(){
        return gulp.src(globs.tests , {read: false})
            .pipe(mocha({require: 'should', reporter: 'spec'}));
    })

    return options
};