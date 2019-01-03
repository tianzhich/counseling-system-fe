const merge = require('webpack-merge');
const common = require('./webpack.common');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


module.exports = merge(common, {
    mode: 'production',
    externals: {
        react: 'React',
        'react-dom': 'ReactDOM',
        '@ant-design/icons/lib/dist': 'AntDesignIcons',
    },
    optimization: {
        minimizer: [
            new UglifyJsPlugin(),
        ],
    },
    plugins: [
        new BundleAnalyzerPlugin(),
    ],
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    }
})