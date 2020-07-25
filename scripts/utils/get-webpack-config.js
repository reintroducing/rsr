const webpackConfig = require('../../config/webpack.config');

const USE_RESOURCES = true;
const RESOURCES_PATH = 'src/common/resources.scss';
const SASS_RESOURCES_LOADER = {
    loader: 'sass-resources-loader',
    options: {
        resources: RESOURCES_PATH,
    },
};

function getWebpackConfig({webpack, mode, userConfig}) {
    const defaultConfig = webpackConfig(mode);
    let {devServer, ...config} = defaultConfig;

    if (userConfig) {
        const {
            analyzer,
            cssModulesIdentName,
            devServerPort,
            devServerProxy,
            devServerOverrides = {},
            optimization,
            plugins,
            rules,
            sourceMap,
            useResources = USE_RESOURCES,
            resourcesPath = RESOURCES_PATH,
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
            ...devServerOverrides,
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
            const analyzerIndex = plugins.findIndex(plugin => {
                return plugin.constructor.name === 'BundleAnalyzerPlugin';
            });

            if (analyzerIndex !== -1) {
                config.plugins[analyzerIndex].opts = {
                    ...plugins[analyzerIndex].opts,
                    ...analyzer,
                };
            }
        }

        if (useResources) {
            config.module.rules[1].use.push({
                loader: 'sass-resources-loader',
                options: {
                    resources: resourcesPath,
                },
            });
        }

        if (cssModulesIdentName) {
            config.module.rules[1].use[1].options.modules.localIdentName = cssModulesIdentName;
        }
    } else {
        config.module.rules[1].use.push(SASS_RESOURCES_LOADER);
    }

    return {
        devServer,
        config,
    };
}

module.exports = getWebpackConfig;
