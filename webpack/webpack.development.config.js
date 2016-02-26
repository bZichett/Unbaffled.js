var config = require('./webpack.default.config').config

module.exports.webpackConfig = config({
    output: {
        path: path.join(__dirname, "build", "development"),
        publicPath: path.join(__dirname, "build", "development"),
    }
})