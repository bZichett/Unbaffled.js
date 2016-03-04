var path = require("path");
var ROOT_DIR = path.resolve(__dirname)

var webpack = require("webpack");


var definePlugin = new webpack.DefinePlugin({
	__DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
	__PRERELEASE__: JSON.stringify(JSON.parse(process.env.BUILD_PRERELEASE || 'false'))
});

var ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports.production = ["PRODUCTION"]
module.exports.development = ["DEVELOPMENT"]

// TODO customizable css name dir
var extractSCSS = new ExtractTextPlugin("css/[name].css", {publicPath: 'css'})

var config = {

	__filename: true,
	__dirname: true,

	output: {
		path: path.resolve(ROOT_DIR, "build"),
		publicPath: path.resolve(ROOT_DIR, "assets"),
		filename: "js/[name].js",
		chunkFilename: "[name].js",
	},
	split: true,
	test: /(\.jsx?)$/,
	stats: {
		colors: true,
	},
	resolve: {
		extensions: ['', '.js', '.scss', '.css']
	},
	module: {
		loaders: [

			{ test: /\.(png|woff|woff2|eot|ttf|svg)$/, loader: 'url-loader?limit=100000' },

			{
				test: /\.scss$/,
				exclude: /(node_modules|bower_components)/,
				// loaders: ["style", "css", "sass"], // <-- Inline
				loader: ExtractTextPlugin.extract([
					"css",
					"resolve-url" ,
					"ruby-sass?sourceMap&indentedSyntax"
				])
			},
			{
				test: /\.js$/,
				exclude: /node_modules/,
				loaders: [
					'babel'
				],
				query: {
					cacheDirectory: true,
					presets: [
						require.resolve('babel-preset-es2015-webpack2')
					],

					// TODO Babel caching optimization plugin: Fails right now...
					plugins: [
						// Note: This is included in .babelrc as plugin due to the pragma option not being available here
						// 'transform-react-jsx'
					]
				}
			},
		]
	},

	exclude: /node_modules/,

	/** PLUGINS */
	plugins: [
		// Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
		// Only emit files when there are no errors
		new webpack.NoErrorsPlugin(),
		extractSCSS,
		new webpack.DefinePlugin({
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
	],

	PRODUCTION: {
		plugins: [
			new webpack.LoaderOptionsPlugin({ // Changed from new webpack.optimize.UglifyJsPlugin() in webpack2
				minimize: true,
				debug: false
			}),
			new webpack.optimize.DedupePlugin(),
			new webpack.optimize.UglifyJsPlugin({
				compress: {drop_console: true}
			}),
		]
	},
	DEVELOPMENT: {
		devServer: true,
		// devtool: "eval",
		// devtool: '#eval-source-map',
		debug: true,
	}

}

module.exports.webpackConfig = config

