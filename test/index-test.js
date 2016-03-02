var nobleScaffold = require('../index');

var exampleDir = '../example/';
var vendorDir = exampleDir + 'vendor/';
// var exec = require('gulp-exec')

var nS = nobleScaffold(
    {
        entryPoints: {
            app: exampleDir + 'app/main.js'
        },
        versionsDir: '../build/',
        modules: {
            vendor: {
                vendor: [
                    vendorDir + 'frameworkX',
                    vendorDir + 'pluginY'
                ]
            },
            es6: {
                lib: [
                    exampleDir + 'lib/**/*.js',
                    '!' + exampleDir + 'lib/**/*-test.js'
                ],
                moduleA: [
                    exampleDir + 'moduleA/**/*.js',
                    '!' + exampleDir + 'moduleA/**/*-test.js'
                ],
                moduleB: [
                    exampleDir + 'moduleB/**/*.js',
                    '!' + exampleDir + 'moduleB/**/*-test.js'
                ]
            },
            scss: {

            }

        }
    })

describe('#unbaffled', function(){
    console.log("nS1", nS.modules.es6)
    nS.modules.es6.should.exist


})

describe('#unbaffled', function(){
    console.log("nS1", nS.modules.versionsDir)
})

