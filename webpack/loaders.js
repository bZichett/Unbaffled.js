/**
 * @module Default loaders.
 */
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = function (config, options, state) {

	/**
	 * Loaders
	 * Reference: http://webpack.github.io/docs/configuration.html#module-loaders
	 * List: http://webpack.github.io/docs/list-of-loaders.html
	 * This handles most of the magic responsible for converting modules
	 */
	config.module.loaders = config.module.loaders.concat([{
		// JS LOADER
		// Reference: https://github.com/babel/babel-loader
		// Transpile .js files using babel-loader
		// Compiles ES6 and ES7 into ES5 code
		test: /\.js$/,
		loaders: ['babel?optional[]=runtime'],
		exclude: function (absPath) {
			return absPath.match(/node_modules/) && !absPath.match(/angular\-ff/);
		}
	}, {
		// Images loader
		// Reference: https://github.com/webpack/url-loader
		// Copy png, jpg, jpeg, gif, svg files to images dir
		// Rename the file using the asset hash
		// Pass along the updated reference to your code
		test: /\.(png|jpg|jpeg|gif|svg)$/,
		loader: 'url?limit=5000&name=images/[name]-[hash].[ext]'
	}, {
		// Icon loader
		// Reference: https://github.com/webpack/file-loader
		// Copy icon files to images dir
		test: /\.(ico|icon)$/,
		loader: 'file?name=images/[name].[ext]'
	}, {
		// woff, woff2, ttf, eot files to output
		// Fonts loader
		// Reference: https://github.com/webpack/file-loader
		// Copy woff, woff2, ttf, eot files to fonts dir
		// Rename the file using the asset hash
		// Pass along the updated reference to your code
		test: /\.(woff|woff2|ttf|eot)$/,
		loader: 'file?name=fonts/[name]-[hash].[ext]'
	}, {
		// HTML LOADER
		// Reference: https://github.com/webpack/raw-loader
		// Allow loading html through js
		test: /\.html$/,
		loader: 'html-loader'
	}, {
		test: /\.jade/,
		loader: 'jade-loader'
	}, {
		test: /\.sass$/,
		// Passing indentedSyntax query param to node-sass
		//loaders: ["style", "css", "postcss", "resolve-url", "sass?sourceMap&indentedSyntax"]
		loader: ExtractTextPlugin.extract("css!postcss!resolve-url!sass?sourceMap&indentedSyntax")
	}]);


};