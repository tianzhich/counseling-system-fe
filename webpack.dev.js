const merge = require('webpack-merge');
const common = require('./webpack.common');
const htmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = merge(common, {
    mode: 'development',
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    module: {
        rules: [
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                test: /\.js$/,
                enforce: "pre",
                loader: "source-map-loader",
                exclude: /node_modules/
            }
        ]
    },
    output: {
        publicPath: '/',
        filename: 'static/js/bundle.js',
    },
    plugins: [
        new htmlWebpackPlugin({
            template: 'public/index.html'
        })
    ],
    devServer: {
        contentBase: './public',
        historyApiFallback: true
    }
});