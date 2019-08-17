const webpackConfig = require('../../config/webpack.config');

function getWebpackConfig({webpack, mode, userConfig}) {
    const defaultConfig = webpackConfig(mode);
    let {devServer, ...config} = defaultConfig;

    if (userConfig) {
        const {
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
    }

    return {
        devServer,
        config,
    };
}

module.exports = getWebpackConfig;
