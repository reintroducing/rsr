const path = require('path');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
    .BundleAnalyzerPlugin;
const eslintFriendlyFormatter = require('eslint-friendly-formatter');
const postCssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const flexbugsFixes = require('postcss-flexbugs-fixes');

module.exports = (mode = 'development') => {
    const isDev = mode === 'development' || mode === 'test';
    const assetPath = process.env.ASSET_PATH;
    const dist = path.resolve(process.cwd(), 'dist');
    const src = path.resolve(process.cwd(), 'src');
    const entry = [`${src}/index.js`];
    const output = {
        filename: `js/[name]${isDev ? '' : '-[hash]'}.js`,
        path: `${dist}`,
    };
    const stats = {
        children: false,
        chunkModules: false,
        chunks: false,
        colors: true,
        hash: false,
        modules: false,
        performance: false,
        timings: true,
    };

    if (isDev) {
        entry.unshift('react-hot-loader/patch');
        output.publicPath = '/';
    } else if (assetPath) {
        output.publicPath = assetPath;
    }

    return {
        mode: isDev ? 'development' : 'production',
        target: 'web',
        devtool: isDev ? 'cheap-module-source-map' : 'source-map',
        entry,
        output,
        plugins: [
            new StyleLintPlugin(),
            new HtmlWebpackPlugin({
                filename: `${dist}/index.html`,
                template: `${src}/index.html`,
            }),
            new WebpackAssetsManifest(),
            new MiniCssExtractPlugin({
                filename: `css/[name]${isDev ? '' : '-[hash]'}.css`,
                chunkFilename: isDev
                    ? 'css/[name]-[id].css'
                    : 'css/[name]-[contenthash].css',
                ignoreOrder: true,
            }),
            new BundleAnalyzerPlugin({
                analyzerMode: isDev ? 'static' : 'disabled',
                openAnalyzer: false,
            }),
        ],
        resolve: {
            alias: {
                ...(isDev && {
                    'react-dom': '@hot-loader/react-dom',
                }),
            },
            modules: ['node_modules', src],
            extensions: ['.js', '.jsx', '.json'],
        },
        module: {
            rules: [
                {
                    test: /\.jsx?$/,
                    exclude: /node_modules/,
                    use: [
                        'babel-loader',
                        {
                            loader: 'eslint-loader',
                            options: {
                                formatter: eslintFriendlyFormatter,
                                emitWarning: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                hmr: isDev,
                                publicPath: (resourcePath, context) => {
                                    return `${path.relative(dist, context)}/`;
                                },
                            },
                        },
                        {
                            loader: 'css-loader',
                            options: {
                                importLoaders: 2,
                                modules: {
                                    localIdentName: '[name]-[local]',
                                },
                                sourceMap: isDev,
                            },
                        },
                        {
                            loader: 'postcss-loader',
                            options: {
                                plugins: [
                                    postCssImport(),
                                    flexbugsFixes(),
                                    postcssPresetEnv(),
                                ],
                            },
                        },
                        {
                            loader: 'sass-loader',
                            options: {
                                sourceMap: isDev,
                            },
                        },
                        {
                            loader: 'sass-resources-loader',
                            options: {
                                resources: 'src/common/resources.scss',
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|svg|jpe?g|gif)$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: `[folder]/[name]${
                                    isDev ? '' : '-[contenthash]'
                                }.[ext]`,
                                outputPath: 'img',
                            },
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                disable: isDev,
                            },
                        },
                    ],
                },
            ],
        },
        stats,
        ...(isDev && {
            devServer: {
                historyApiFallback: true,
                hot: true,
                open: true,
                port: 3000,
                publicPath: '/',
                stats,
                writeToDisk: true,
            },
        }),
        performance: {
            hints: false,
        },
        optimization: {
            ...(!isDev && {
                minimizer: [
                    new OptimizeCssAssetsPlugin({
                        cssProcessorPluginOptions: {
                            preset: [
                                'default',
                                {
                                    discardComments: {
                                        removeAll: true,
                                    },
                                },
                            ],
                        },
                    }),
                    new TerserPlugin({
                        parallel: true,
                        sourceMap: true,
                        terserOptions: {
                            compress: {
                                warnings: false,
                            },
                            output: {
                                comments: false,
                            },
                        },
                    }),
                ],
            }),
        },
    };
};
