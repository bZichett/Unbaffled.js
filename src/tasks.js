var setup = require('./setup')
var utils = require('./utils')

var getNextVersion = utils.getNextVersion
var printDate = utils.printDate
var findByMatchingProperties = utils.findByMatchingProperties

var compareModuleRelease = setup.compareModuleRelease
var buildDistribution = setup.buildDistribution


//gulp.task("release", [].concat("setupRelease", js_tasks, scss_tasks), function(){
//})

gulp.task("release", [].concat("setupRelease"), function(){
})

gulp.task("compileAllDev", [].concat(js_tasks, scss_tasks), function(){
})

gulp.task("dist-scss", scss_tasks, function(){
})

gulp.task("dist-js", js_tasks, function(){
})