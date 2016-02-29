var path = require("path");
var ROOT_DIR = path.resolve(__dirname, '..')

var webpack = require("webpack");

var nodeEnv = process.env.NODE_ENV || 'development';

var merge = require('webpack-merge')

var definePlugin = new webpack.DefinePlugin({
    __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
    __PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

var defaultConfig = {
    devtool: '#eval-source-map',
    __filename: true,
    __dirname: true,
    output: {
        // path: Must implement by inherited config file
        filename: "[name].js",
        //filename: "[name]-[chunkhash].js",
        chunkFilename: "[name].js",
        //chunkFilename: "[name]-[chunkhash].js"
    },
    test: /(\.jsx?)$/,
    stats: {
        colors: true,
    },
    loaders: [
        {
            test: /\.html$/,
            loader: 'file',
            query: {
                name: '[name].[ext]'
            }
        },
        {
            test: /\.css$/,
            loaders: [
                'style',
                'css'
            ]
        },
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
    //resolve: {
    //    extensions: ['', '.js'],
    //    mainFiles: [example_dir],
    //    alias: {},
    //    modules: [example_dir, node_modules_dir],
    //},
    //resolveLoader: {
    //    modulesDirectories: [
    //        example_dir, node_modules_dir
    //    ],
    //    root: [example_dir, node_modules_dir],
    //},
    plugins: [definePlugin]
}

if (process.env.NODE_ENV !== 'production') {
    defaultConfig.devtool = 'source-map';
    defaultConfig.debug = true;
}

module.exports.webpackConfig = defaultConfig

module.exports.config = function (overrides) {
    return merge(defaultConfig, overrides || {});
}

