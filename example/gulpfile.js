var unbaffled = require('../index');

var dir = {
    root: './',
    vendor: 'vendor/',
    es6: 'src/es6/'
}

var options = {
    dir: {
        dist: 'build',
        src: {
            es6: dir.es6
        },
        scss: {
            folderName: 'scss'
        },
        js: {
            entries: [dir.es6 + 'app/main']
        },
        versionManifest: {
            location: '.',
            name: 'version-manifest'
        }
    },
    test: {
        fileGlob: '-test'
    },
    vendorFiles: [
        (dir.vendor + 'frameworkX.js'),
        (dir.vendor + 'pluginY.js')
    ],
    entryPoints: ['./app/main'],
    modules: {
        language: {
            es6: {
                'app': [
                    dir.root + 'app/**/*.js',
                    '!' + dir.root + 'lib/**/*-test.js'
                ],
                'lib': [
                    dir.root + 'lib/**/*.js',
                    '!' + dir.root + 'lib/**/*-test.js'
                ]
            }
        }
    }
};

unbaffled(options)