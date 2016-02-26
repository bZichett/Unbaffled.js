var distributionName

var options = require('../index')

var fs = require('fs')

var argv = require('yargs').argv;
var generate = require('project-name-generator')
var exec = require('./gulp-exec')

var utils = require('./utils')
var printDate = utils.printDate
var findByMatchingProperties = utils.findByMatchingProperties
var getNextVersion = utils.getNextVersion

module.exports = {
    setupRelease: function () {
        distributionName = generate().dashed

        var versions = JSON.parse(fs.readFileSync(dir.dist + 'manifest.json', 'utf8'))
        var versionNames = versions.map(function (version) {
            return version.name
        })

        // If this is a production release, toggle the production flag which means it'll load for end users
        if (!!argv.production) {
            var productionVersion = findByMatchingProperties(versions, {production: true})[0]
            if (productionVersion)
                productionVersion.production = false
        }

        var newVersion = {
            name: distributionName,
            id: getNextVersion(productionVersion ? productionVersion.id : "0.0.0", argv.type ? argv.type : 'patch'),
            type: argv.type ? argv.type : 'patch',
            //branch: exec('git rev-parse --abbrev-ref HEAD | cat', function (err, stdout, stderr) {
            //	return stdout;
            //}),
            production: !!argv.production,
            created: printDate(),
            timestamp: new Date(),
            notes: argv.notes ? argv.notes : "N/A",
            schemaChange: argv.schemaChange ? true : false,
            modules: {'js': {}, 'css': {}, 'vendor': {}}
        }

        // If an old version exists
        if (versions.length > 0) {
            console.log("Old versions exist")

            // We need to compare the modified date of the last distribution module
            // with the modified date of the development module.
            // By doing this, we'll collect the names
            // of the most recently changed modules
            //var developmentModulesJS = fs.readdirSync(dir.dist + 'development/js');
            //var developmentModulesCSS = fs.readdirSync(dir.dist + 'development/css');
            //var developmentModulesVendor = fs.readdirSync(dir.dist + 'development/vendor');

            var moduleModifiedMapJS = {}

            dir.modules.forEach(function (module) {
                var stats = fs.statSync(dir.dist + 'development/' + 'js' + '/' + module + '.js')
                moduleModifiedMapJS[module] = stats.mtime
            })

            var moduleModifiedMapCSS = {}

            Object.keys(dir.scssGlobs).forEach(function (module) {
                var stats = fs.statSync(dir.dist + 'development/' + 'css' + '/' + module + '.css')
                moduleModifiedMapCSS[module] = stats.mtime
            })

            var moduleModifiedMapVendor = {}
            var vendorModules = ['vendor']
            vendorModules.forEach(function (module) {
                var stats = fs.statSync(dir.dist + 'development/' + 'vendor' + '/' + module + '.js')
                moduleModifiedMapVendor[module] = stats.mtime

            })

            //console.log(moduleModifiedMapJS)
            //console.log(moduleModifiedMapCSS)
            //console.log(moduleModifiedMapVendor)

            // Compare to most recent deployed release
            //for(var j=0; j < versionNames.length; j++){
            var oldVersion = versions[0]

            // Iterate through all distribution types starting
            // with the newest until all modules are collected

            this.compareModuleRelease('vendor', 'js', moduleModifiedMapVendor, oldVersion, newVersion)
            this.compareModuleRelease('js', 'js', moduleModifiedMapJS, oldVersion, newVersion)
            this.compareModuleRelease('css', 'css', moduleModifiedMapCSS, oldVersion, newVersion)
            // If module is found, add to the dictionary
            // If it's not found, then we must use the development version
            //}

            //console.log(developmentModulesJS)
            //console.log(developmentModulesCSS)
            //console.log(developmentModulesVendor)
        } else {

            // First distribution
            for (var i = 0; i < dir.modules.length; i++) {
                // Find last modified file.  If the development folder is more recently modified than
                // the last found module version, replace it with the new name.
                newVersion.modules.js[dir.modules[i]] = distributionName
            }
            Object.keys(dir.scssGlobs).forEach(function (module) {
                newVersion.modules.css[module] = distributionName
            })
            newVersion.modules.vendor = {vendor: distributionName ? distributionName : 'development'}
        }

        // Now add the currently released version to the manifest
        versions.unshift(newVersion)


        // Now build new minified modules into the new distriubtion
        this.buildDistribution(newVersion)

        // And remove any older entries if needed
        //if(versions.length > 5){
        //	var oldest = versions.pop()
        //	fs.unlink(dir.dist + oldest.name, function(err, data){
        //	})
        //}

        // This will be the new distribution directory
        if (!fs.existsSync(dir.dist + distributionName)) {
            fs.mkdirSync(dir.dist + distributionName);
        }

        fs.writeFile(dir.dist + 'manifest.json', JSON.stringify(versions), function (err, data) {
            if (err) {
                return console.log(err);
            }
        });

    },

    buildDistribution: function (newVersionManifest) {

        Object.keys(newVersionManifest.modules.js).forEach(function (moduleName) {
            exec('gulp js-' + moduleName + ' --production --distributionName ' + distributionName, function (err, stdout, stderr) {
                console.log(moduleName, stderr);
            });
        })

        Object.keys(newVersionManifest.modules.css).forEach(function (moduleName) {
            exec('gulp scss-' + moduleName + ' --production --distributionName ' + distributionName, function (err, stdout, stderr) {
                console.log(moduleName, stderr);
            });
        })

        Object.keys(newVersionManifest.modules.vendor).forEach(function (moduleName) {
            exec('gulp js-' + moduleName + ' --production --distributionName ' + distributionName, function (err, stdout, stderr) {
                console.log(moduleName, stderr);
            });
        })
    },

    compareModuleRelease: function (bundleDir, fileType, devModulesModified, oldVersion, newVersion) {

        var oldVersionModules = oldVersion.modules[bundleDir]
        var newVersionModules = newVersion.modules[bundleDir]

        var keys = Object.keys(devModulesModified)
        for (var i = 0; i < keys.length; i++) {

            var moduleName = keys[i]
            var modifiedTime = devModulesModified[keys[i]]
            var stats

            try {
                stats = fs.statSync(options.versionsDir + oldVersion.name + '/' + bundleDir + '/' + moduleName + "." + fileType)
            } catch (e) {
                stats = false
            }

            if (!modifiedTime)                     newVersionModules[moduleName] = distributionName
            else if (modifiedTime > stats.mtime) newVersionModules[moduleName] = distributionName
            else
                newVersionModules[moduleName] = oldVersionModules[moduleName] != 'development' ? oldVersionModules[moduleName] : distributionName
            // Or ... do nothing;
            // and we'll collect the version name from the previous version
        }
    },

    updateDevManifest: function (bundleName, module) {
        try {


            var versions = JSON.parse(fs.readFileSync(options.versionsDir + 'manifest.json', 'utf8'))

            // If this is a production release, toggle the production flag which means it'll load for end users
            var devVersion = findByMatchingProperties(versions, {development: true})[0]

            devVersion.modules[bundleName][module] = 'development'
            devVersion.created = printDate()
            devVersion.timestamp = new Date()

            fs.writeFile(options.versionsDir + 'manifest.json', JSON.stringify(versions), function (err, data) {
                if (err) {
                    return console.log(err);
                }
            });
        } catch (e) {
        }
    }
}