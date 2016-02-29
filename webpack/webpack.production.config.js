/** Path */
var path = require("path");
var ROOT_DIR = path.resolve(__dirname, '..')
var EXAMPLE_DIR = path.join(ROOT_DIR, 'example')

/** Config inheritance */
var config = require('./webpack.default.config').config

/** Webpack */
var webpack = require("webpack");
var webpackDevServer = require('webpack-dev-server');

var node_modules_dir = path.resolve(ROOT_DIR, 'node_modules');
var example_dir = path.resolve(ROOT_DIR, 'example')

/** Plugins */
//var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
// var SplitByPathPlugin = require('webpack-split-by-path');

/** Environment variables */
var nodeEnv = process.env.NODE_ENV || 'development';


console.log("Webpack Production Mode")

module.exports.webpackConfig = config({
    output: {
        path: path.join(ROOT_DIR, "build"),
        publicPath: path.join(ROOT_DIR, "assets"),
        filename: "[name].js",
        //filename: "[name]-[chunkhash].js",
        chunkFilename: "[name].js",
        //chunkFilename: "[name]-[chunkhash].js"
    }
})