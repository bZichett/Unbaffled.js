var unbaffled = require('../index')
var path = require('path')

var webpackConfig = require('./webpack.config').webpackConfig
var devKeys = require('./webpack.config').development
var prodKeys = require('./webpack.config').production

var dir = {
    root: __dirname,
    vendor: './vendor/'
}

var options = {
    entry: [path.resolve('./src/es6/app/main.js')],
    webpackConfig: webpackConfig,
    regulate: {
      development: devKeys,
      production: prodKeys
    },
    split: true,
    dir: {
        root: __dirname,
        dist: 'build',
        release: 'versions',
        development: 'development',
        srcDir: 'src',
        src: {
            es6: 'src/es6/'
        },
        scss: {
            folderName: 'scss'
        },
        js: {
            entries: [path.resolve('src', 'es6', 'app', 'main')]
        },
        languages: {
            es6: 'src/es6/'
        },
        manifest: {
            versions: {
                location: '.',
                name: 'manifest-versions'
            },
            development: {
                location: '.',
                name: 'manifest-development'
            }
        },
    },
    test: {
        fileGlob: '-test'
    },
    vendorFiles: [
        (dir.vendor + 'frameworkX.js'),
        (dir.vendor + 'pluginY.js')
    ],
    modules: {
        language: {
            es6: {
                app: [
                    dir.root + 'app/**/*.js',
                    '!' + dir.root + 'app/**/*-test.js'
                ],
                lib: [
                    dir.root + 'lib/**/*.js',
                    '!' + dir.root + 'lib/**/*-test.js'
                ],
                moduleA: [
                    dir.root + 'moduleA/**/*.js',
                    '!' + dir.root + 'moduleA/**/*-test.js'
                ],
                moduleB: [
                    dir.root + 'moduleB/**/*.js',
                    '!' + dir.root + 'moduleB/**/*-test.js'
                ],
                moduleC: [
                    dir.root + 'moduleC/**/*.js',
                    '!' + dir.root + 'moduleC/**/*-test.js'
                ],
                //vendor: [
                //    dir.root + 'vendor/**/*.js',
                //    '!' + dir.root + 'vendor/**/*-test.js'
                //]
            }
        }
    }
};

unbaffled(options)