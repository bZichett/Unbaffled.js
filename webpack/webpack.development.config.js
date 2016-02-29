/** Path */
var path = require("path");
var ROOT_DIR = path.resolve(__dirname, '..')
var EXAMPLE_DIR = path.join(ROOT_DIR, 'example')

/** Config inheritance */
var config = require('./webpack.default.config').config

console.log("Webpack Development Mode")

module.exports.webpackConfig = config({
    output: {
        path: path.join(ROOT_DIR, "build"),
        publicPath: path.join(ROOT_DIR, "assets"),
    }
})