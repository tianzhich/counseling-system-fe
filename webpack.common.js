const path = require('path');
const tsImportPluginFactory = require('ts-import-plugin')

module.exports = {
    entry: './src/index.tsx',
    module: {
        rules: [{
                test: /\.tsx?$/,
                loader: 'awesome-typescript-loader',
                options: {
                    getCustomTransformers: () => ({
                        before: [tsImportPluginFactory({
                            libraryName: 'antd',
                            libraryDirectory: 'es',
                            style: true
                        })]
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
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        alias: {
            '@src': path.resolve(__dirname, 'src'),
            '@common': path.resolve(__dirname, 'src/common'),
            '@features': path.resolve(__dirname, 'src/features'),
            '@styles': path.resolve(__dirname, 'src/styles'),
            '@utils': path.resolve(__dirname, 'src/utils'),
            '@types': path.resolve(__dirname, 'src/features/common/types.ts'),
            '@fakeData': path.resolve(__dirname, 'src/features/common/fakeData.ts'),
            '@map': path.resolve(__dirname, 'src/features/common/map.ts')
        }
    }
};