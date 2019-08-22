const webpackConfig = require('../../config/webpack.config');

function getWebpackConfig({webpack, mode, userConfig}) {
    const defaultConfig = webpackConfig(mode);
    let {devServer, ...config} = defaultConfig;

    if (userConfig) {
        const {
            analyzer,
            devServerPort,
            devServerProxy,
            optimization,
            plugins,
            rules,
            sourceMap,
        } = userConfig({
            webpack,
            mode,
            defaultConfig,
        });

        devServer = {
            ...devServer,
            ...(devServerPort && {
                port: devServerPort,
            }),
            ...(devServerProxy && {
                proxy: devServerProxy,
            }),
        };
        config = {
            ...config,
            ...(typeof sourceMap !== 'undefined' && {
                devtool: sourceMap,
            }),
            ...(plugins && config.plugins.push(...plugins)),
            ...(rules && config.module.rules.push(...rules)),
            ...(optimization && {
                optimization: {
                    ...config.optimization,
                    ...optimization,
                },
            }),
        };

        if (analyzer) {
            const analyzerIndex = config.plugins.findIndex(plugin => {
                return plugin.constructor.name === 'BundleAnalyzerPlugin';
            });

            if (analyzerIndex !== -1) {
                config.plugins[analyzerIndex].opts = {
                    ...config.plugins[analyzerIndex].opts,
                    ...analyzer,
                };
            }
        }
    }

    return {
        devServer,
        config,
    };
}

module.exports = getWebpackConfig;
