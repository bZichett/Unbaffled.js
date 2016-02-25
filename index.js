var gulp = require('gulp')
var path = require('path');
var concat = require('gulp-concat');
var babel = require('gulp-babel');
var sass = require("gulp-ruby-sass");
var mocha = require("gulp-mocha")

module.exports = function(options) {

    options = options || {};

    options.modules = options.modules || {};
    options.versionsDir = options.versionsDir || '/dist';

    var globs = {
        tests: ['test/*-test.js',
            Object.keys(options.modules.es6).map(function(moduleName){return options.modules.es6[moduleName][0]})]

    }
    console.log(globs)

    gulp.task('test', function(){
        return gulp.src(globs.tests , {read: false})
            .pipe(mocha({reporter: 'spec'}));
    })

};