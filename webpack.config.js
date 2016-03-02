var path = require("path");
var ROOT_DIR = path.resolve(__dirname)

var webpack = require("webpack");

var nodeEnv = process.env.NODE_ENV || 'development';

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
		filename: "[name].js",
		//filename: "[name]-[chunkhash].js",
		chunkFilename: "[name].js",
		//chunkFilename: "[name]-[chunkhash].js"
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

			//{
			//	test: /\.html$/,
			//	loader: 'file',
			//	query: {
			//		name: '[name].[ext]'
			//	}
			//},
			{
				test: /\.scss$/,
				exclude: /(node_modules|bower_components)/,
				// loaders: ["style", "css", "sass"], // <-- Inline
				loader: ExtractTextPlugin.extract([
					"css",
					"resolve-url" ,
					"sass?sourceMap&indentedSyntax"
				]),

				//loaders: [ // Alternate Syntax

				//	"style-loader",
				//	{
				//		loader: "css-loader",
				//		//query: {
				//		//	modules: true
				//		//}
				//	},
				//	{
				//		loader: "sass-loader" //?indentedSyntax",
				//		//query: {
				//		//	includePaths: [
				//		//		path.resolve(__dirname, "some-folder")
				//		//	]
				//		//}
				//	}
				//]

			},
			//{
			//	test: /\.scss$/,
			//	// Passing indentedSyntax query param to node-sass
			//	loaders: ["style", "css", "sass?indentedSyntax"],
			//	//loaders: ExtractTextPlugin.extract("style-loader", "css-loader!scss-loader")
			//
			//},
			{
			    test: /\.js$/,
			    exclude: /node_modules/,
			    loaders: [
			        // 'react-hot',
			        'babel'
			    ],
				query: {
					cacheDirectory: true,
					//presets: ['react', 'es2015-webpack2'],
					presets: [
						// require.resolve("babel-preset-react?pragma=m"),
						require.resolve('babel-preset-es2015-webpack2')
					],
					// TODO Optimization: Fails right now...
					plugins: [
						//require.resolve('babel-plugin-transform-runtime')
					]
				}
			},
		]
	},

	// Only needed if scss is external to all JS modules, and not required within them
	//sassLoader: {
	//	includePaths: [path.resolve(__dirname, "./some-folder")]
	//},

	exclude: /node_modules/,

	/** PLUGINS */
	plugins: [
		// Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
		// Only emit files when there are no errors
		new webpack.NoErrorsPlugin(),

		// Make the JSX pragma function available everywhere without the need
		// to use "require"
		//new webpack.ProvidePlugin({
		//	['m']: path.join(__dirname, "utils", "element"),
		//}),

		// Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
		// Dedupe modules in the output
		//new webpack.optimize.DedupePlugin(),

		extractSCSS
	],
	//	PRODUCTION: {
	//		plugins: [
	//			new webpack.LoaderOptionsPlugin({
	//				minimize: true,
	//				debug: false
	//			}),
	//			extractSCSS
	//		]
	//	},
	//	DEVELOPMENT: {
	//		plugins: [
	//			extractSCSS
	//		]
	//	}
	//},


	PRODUCTION: {
		PRODUCTION_UNBAFFLED: true,
		output: {
			path: path.join(ROOT_DIR, "build"),
			publicPath: path.join(ROOT_DIR, "assets"),
			filename: "js/[name].js",
			chunkFilename: "[name].js",
		},
		plugins: [
			new webpack.LoaderOptionsPlugin({ // Changed from new webpack.optimize.UglifyJsPlugin() in webpack2
						minimize: true,
						debug: false
					}),
		]
	},
	DEVELOPMENT: {
		DEVELOPMENT_UNBAFFLED: true,
		devServer: true,
		//devtool: "eval",
		//devtool: '#eval-source-map',

		debug: true,
		output: {
			path: path.join(ROOT_DIR, "build"),
			publicPath: path.join(ROOT_DIR, "assets"),
			//filename: "[name]-dev.js",
			filename: "js/[name].js",
			//chunkFilename: "[name]-dev.js",
			chunkFilename: "[name].js",
			//filename: "[name]-[chunkhash].js",
			//chunkFilename: "[name]-[chunkhash].js"
		}
	},

}

//if (process.env.NODE_ENV !== 'production') {
//	config.devtool = 'source-map';
//	config.debug = true;
//}

module.exports.webpackConfig = config

