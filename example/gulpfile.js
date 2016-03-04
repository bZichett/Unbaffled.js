var unbaffled = require('../index')
var path = require('path')

var webpackConfig = require('./webpack.config').webpackConfig
var devKeys = require('./webpack.config').development
var prodKeys = require('./webpack.config').production

var dir = {
    root: __dirname,
    vendor: 'bower_components/'
}

var options = {

    webpackConfig: webpackConfig,
    webpackDevServer: {},
    keys: {
        production: ["PRODUCTION"],
        development: ["DEVELOPMENT"]
    },

    split: false,
    // Split by name plugin

    versionsToKeep: 2,
    // If not supplied, keep all.  If an older version contains a required dependency it won't be deleted

    dir: {
        root: __dirname,
        dist: 'build',
        release: 'versions',
        development: 'development',
        vendor: dir.vendor,
        src: {
            js: 'src/js/'
        },
        languages: {
            js: 'src/js/'
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
        }
    },
    test: {
        fileGlob: '-test'
    },

    modules: {
        js: {
            // NOTE: Object form to allow future options for specific modules
            app: {},
            lib: {},
            'modules/moduleA': {},
            'modules/moduleB': {},
            'modules/moduleC': {}
        }
    }
};

unbaffled(options)