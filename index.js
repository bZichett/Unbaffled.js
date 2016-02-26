// NODE
var path = require('path');

// GULP TOOLS
var gulp = require('gulp')
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var sass = require("gulp-ruby-sass");
var mocha = require("gulp-mocha")

// SCAFFOLD
var setupRelease = require("setup").setupRelease

module.exports = function(options) {

    options = options || {};

    options.entryPoints = options.entryPoints || false
    if(!options.entryPoints) throw Error('Need to specify at least one entry point');

    options.modules = options.modules || {};
    if(!options.modules) throw Error('Need to specify at least one module');

    options.versionsDir = options.versionsDir || '/dist';
    if(!options.modules) throw Error('Need to specify location of version directory');

    var globs = {
        tests: ['test/*-test.js'].concat(
            Object.keys(options.modules.es6).map(function(moduleName){return options.modules.es6[moduleName][0]}))

    }

    console.log(globs)

    gulp.task('setupRelease', function(){
        setupRelease()
    })


    gulp.task('test', function(){
        return gulp.src(globs.tests , {read: false})
            .pipe(mocha({require: 'should', reporter: 'spec'}));
    })

    return options
};