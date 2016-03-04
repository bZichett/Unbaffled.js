var path = require('path')
var ROOT_DIR = path.resolve(__dirname)

var node_modules_dir = path.resolve(ROOT_DIR, 'node_modules');
var js_dir = path.resolve(ROOT_DIR, 'src', 'js')
var modules_dir = path.resolve(ROOT_DIR, 'src', 'js', 'modules')
var vendor_dir = path.resolve(ROOT_DIR, 'bower_components')

module.exports.webpackConfig = {

    context: ROOT_DIR,
    entry: {
        app: path.resolve(js_dir, 'app', 'main.js'),
        //lib: path.resolve(js_dir, 'lib'),
        //moduleA: path.resolve(modules_dir, 'moduleA'),
        //moduleB: path.resolve(modules_dir, 'moduleB'),
        //moduleC: path.resolve(modules_dir, 'moduleC'),
        vendor: [
            path.resolve(vendor_dir, 'mithril', 'mithril.min.js'),
        ]
    },
    devServer: {},
    resolve: {
        alias: {
        },
        modules: [
            js_dir,
            modules_dir,
            vendor_dir,
            node_modules_dir]
    },

    output: {
        path: "build",
        publicPath: "assets"
    },

    externals: {
        m: path.resolve(vendor_dir, 'mithril', 'mithril.min.js'),
    },

    PRODUCTION: {
        //devtool: 'cheap-module-source-map'
    },

    DEVELOPMENT: {
        devServer: {
            contentBase: path.resolve(ROOT_DIR, "build")
        }
    }
}
