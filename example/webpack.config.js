var path = require('path')
var ROOT_DIR = path.resolve(__dirname)

var node_modules_dir = path.resolve(ROOT_DIR, 'node_modules');
var src_dir = path.resolve(ROOT_DIR, 'src', 'es6')
var vendor_dir = path.resolve(ROOT_DIR, 'vendor')

module.exports.production = ["PRODUCTION"]
module.exports.development = ["DEVELOPMENT"]

module.exports.webpackConfig = {

    //
    context: ROOT_DIR,
    __filename: true,
    __dirname: true,

    entry: [
        path.resolve("./src/es6/app/main.js")
    ],

    resolve: {
        extensions: ['', '.js', '.scss'],
        //mainFiles: [src_dir, vendor_dir],
        alias: {
            example: path.resolve(ROOT_DIR, 'src', 'es6'),
            vendor: path.resolve(ROOT_DIR, 'vendor'),
        },
        //modulesDirectories: [src_dir, vendor_dir],
        modules: [src_dir, vendor_dir, node_modules_dir]
    },

    resolveLoader: {
        modulesDirectories: [
            src_dir, node_modules_dir, vendor_dir
        ],
        root: [src_dir, vendor_dir, node_modules_dir]
    },

    PRODUCTION: {
        PRODUCTION_USER: true,
        output: {
            path: "build",
            publicPath: "assets",
        }
    },
    DEVELOPMENT: {
        DEVELOPMENT_USER: true,
        output: {
            path: "build",
            publicPath: "assets"
        },
        resolve: {
            alias: {
                example: path.resolve(ROOT_DIR, 'src', 'es6'),
                vendor: path.resolve(ROOT_DIR, 'vendor'),
            },
            modules: [src_dir, vendor_dir, node_modules_dir]
        },

        resolveLoader: {
            modulesDirectories: [
                src_dir, node_modules_dir, vendor_dir
            ],
            root: [src_dir, vendor_dir, node_modules_dir]
        },
        devServer: {
            contentBase: path.resolve(ROOT_DIR, "build")
        }
    }
}
