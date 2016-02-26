var webpack = require("webpack");
//var webpackDevServer = require('webpack-dev-server');
//var CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin
var SplitByPathPlugin = require('webpack-split-by-path');

var path = require("path");

var node_modules_dir = path.resolve(__dirname, 'node_modules');
var example_dir = path.resolve(__dirname, 'example')

var nodeEnv = process.env.NODE_ENV || 'development';

var DeepMerge = require('deep-merge');

var deepmerge = DeepMerge(function (target, source, key) {
    if (target instanceof Array) {
        return [].concat(target, source);
    }
    return source;
});

var defaultConfig = {
    devtool: '#eval-source-map',
    __filename: true,
    __dirname: true,
    context: __dirname,
    entry: {
        app: path.resolve(__dirname, "example/app/main.js")
    },
    output: {
        path: path.join(__dirname, "build"),
        publicPath: path.join(__dirname, "build"),
        filename: "[name].js",
        //filename: "[name]-[chunkhash].js",
        chunkFilename: "[name].js",
        //chunkFilename: "[name]-[chunkhash].js"
    },
    test: /(\.jsx?)$/,
    loaders: [
        //{
        //    test: /\.html$/,
        //    loader: 'file',
        //    query: {
        //        name: '[name].[ext]'
        //    }
        //},
        //{
        //    test: /\.css$/,
        //    loaders: [
        //        'style',
        //        'css'
        //    ]
        //},
        //{
        //    test: /\.(js|jsx)$/,
        //    exclude: /node_modules/,
        //    loaders: [
        //        // 'react-hot',
        //        'babel-loader'
        //    ]
        //},
    ],
    exclude: /node_modules/,
    query: {
        "plugins": ["transform-decorators-legacy"],
        "presets": ["es2015-webpack2", "react"]
    },
    resolve: {
        extensions: ['', '.js'],
        mainFiles: [example_dir],
        alias: {},
        modules: [example_dir, node_modules_dir],
    },
    resolveLoader: {
        modulesDirectories: [
            example_dir, node_modules_dir
        ],
        root: [example_dir, node_modules_dir],
    },
    plugins: [
        new SplitByPathPlugin([
                {
                    name: 'app',
                    path: path.join(__dirname, 'example/app')
                },
                {
                    name: 'vendor',
                    path: path.join(__dirname, 'example/vendor')
                },
                {
                    name: 'moduleA',
                    path: path.join(__dirname, 'example/moduleA')
                },
                {
                    name: 'moduleB',
                    path: path.join(__dirname, 'example/moduleB')
                },
                {
                    name: 'lib',
                    path: path.join(__dirname, 'example/lib')
                }
            ]
        ),
        //new webpack.LoaderOptionsPlugin({
        //    minimize: true,
        //    debug: false
        //}),
        //new webpack.optimize.UglifyJsPlugin({
        //    compress: {
        //        warnings: false
        //    },
        //    sourceMap: false
        //}),
        //new webpack.DefinePlugin({
        //    'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
        //})

        //new CommonsChunkPlugin({
        //    name: "admin-commons",
        //    chunks: ["adminPageA", "adminPageB"]
        //}),
        //new CommonsChunkPlugin({
        //    name: "commons",
        //    chunks: ["pageA", "pageB", "admin-commons.js"],
        //    minChunks: 2
        //}),
        //new CommonsChunkPlugin({
        //    name: "c-commons",
        //    chunks: ["pageC", "adminPageC"]
        //}),
    ]
}


if (process.env.NODE_ENV !== 'production') {
    defaultConfig.devtool = 'source-map';
    defaultConfig.debug = true;
}

module.exports.webpackConfig = defaultConfig

module.exports.config = function (overrides) {
    return deepmerge(defaultConfig, overrides || {});
}

