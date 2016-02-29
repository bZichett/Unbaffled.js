var unbaffled = require('../index')
var path = require('path')

var webpackConfig = {
    default: require('./webpack/webpack.default.config'),
    development: require('./webpack/webpack.development.config'),
    production: require('./webpack/webpack.production.config')
}

var dir = {
    root: './',
    vendor: 'vendor/',
}

var options = {
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
            entries: [path.resolve('src/es6/', 'app', 'main')]
        },
        languages: {
            es6: 'src/es6/'
        },
        versionManifest: {
            location: '.',
            name: 'version-manifest'
        }
    },
    webpack: {
        entry: [path.resolve('./src/es6/app/main.js')],
        config: {
            default: webpackConfig.default,
            development: webpackConfig.development,
            production: webpackConfig.production
        }
    },
    test: {
        fileGlob: '-test'
    },
    vendorFiles: [
        (dir.vendor + 'frameworkX.js'),
        (dir.vendor + 'pluginY.js')
    ],
    entryPoints: [path.resolve('./src/es6/app/main.js')],
    modules: {
        language: {
            es6: {
                'app': [
                    dir.root + 'app/**/*.js',
                    '!' + dir.root + 'app/**/*-test.js'
                ],
                'lib': [
                    dir.root + 'lib/**/*.js',
                    '!' + dir.root + 'lib/**/*-test.js'
                ],
                'moduleA': [
                    dir.root + 'moduleA/**/*.js',
                    '!' + dir.root + 'moduleA/**/*-test.js'
                ],
                'moduleB': [
                    dir.root + 'moduleB/**/*.js',
                    '!' + dir.root + 'moduleB/**/*-test.js'
                ],
                'moduleC': [
                    dir.root + 'moduleC/**/*.js',
                    '!' + dir.root + 'moduleC/**/*-test.js'
                ],
                'vendor': [
                    dir.root + 'vendor/**/*.js',
                    '!' + dir.root + 'vendor/**/*-test.js'
                ]
            }
        }
    }
};

unbaffled(options)