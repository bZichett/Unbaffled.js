/** Path */
var path = require("path");
var ROOT_DIR = path.resolve(__dirname, '..')
var EXAMPLE_DIR = path.join(ROOT_DIR, 'example')

/** Config inheritance */
var config = require('./webpack.default.config').config
var merge = require('webpack-merge')

console.log("Webpack Development Mode")

module.exports = function(options){

    var webpackConfig = config({
        devServer: true,
        devtool: "eval",
        debug: true,
        output: {
            path: path.join(ROOT_DIR, "build"),
            publicPath: path.join(ROOT_DIR, "assets")
        }
    })

    return webpackConfig
}