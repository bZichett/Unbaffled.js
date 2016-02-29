var path = require('path')
var ROOT_DIR = path.resolve(__dirname, '..')

var node_modules_dir = path.resolve(ROOT_DIR, 'node_modules');
var src_dir = path.resolve(ROOT_DIR, 'src', 'es6')
var vendor_dir = path.resolve(ROOT_DIR, 'vendor')

console.log("ROOT", ROOT_DIR)

module.exports = {
    context: ROOT_DIR,
    devtool: '#eval-source-map',
    __filename: true,
    ROOT_DIR: true,
    entry: {
        app: path.resolve("./src/es6/app/main.js")
    },
    resolve: {
        extensions: ['', '.js'],
        mainFiles: [src_dir, vendor_dir],
        alias: {},
        modules: [src_dir, vendor_dir, node_modules_dir]
    },
    resolveLoader: {
        modulesDirectories: [
            src_dir, node_modules_dir, vendor_dir
        ],
        root: [src_dir, vendor_dir, node_modules_dir]
    },
    devServer: {
        contentBase: path.resolve(ROOT_DIR, "build/")
    },
    output: {
        filename: "[name].js",
        //filename: "[name]-[chunkhash].js",
        chunkFilename: "[name].js",
        //chunkFilename: "[name]-[chunkhash].js"
    }
}
