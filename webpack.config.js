const path = require('path');
const tsImportPluginFactory = require('ts-import-plugin')

module.exports = {
    entry: './src/index.tsx',
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    module: {
        rules: [{
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    getCustomTransformers: () => ({
                        before: [tsImportPluginFactory({ libraryName: 'antd', libraryDirectory: 'es', style: true })]
                    }),
                },
                exclude: /node_modules/
            },
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', {
                    loader: "less-loader",
                    options: {
                        javascriptEnabled: true
                    }
                }],
            },
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {
                enforce: "pre",
                test: /\.js$/,
                loader: "source-map-loader",
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    },
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        contentBase: './dist'
    }
};