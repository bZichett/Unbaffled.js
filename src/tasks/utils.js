var rimraf = require('rimraf')
var makeManifestPath = require('../utils').makeManifestPath
var gulp = require('gulp')

module.exports = function (options) {
	gulp.task('clean', function(){
		var dir = options.dir
		rimraf(dir.release, function(error){});
		rimraf(dir.development, function(error){});
		rimraf(makeManifestPath(dir.manifest.versions), function(error){});
		rimraf(makeManifestPath(dir.manifest.development), function(error){});
	})
}
