/* eslint-disable no-console */
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const chalk = require('chalk');
const webpack = require('webpack');
const getUserConfig = require('./utils/get-user-config');
const getWebpackConfig = require('./utils/get-webpack-config');

function runWebpack(userConfig) {
    console.log(
        chalk.green(
            'Webpack is compiling your project for production. Please be patient, this may take a few minutes...'
        )
    );

    const {config} = getWebpackConfig({
        webpack,
        mode: 'production',
        userConfig,
    });

    webpack(config, (error, stats) => {
        if (error) {
            console.log(
                chalk.red('Webpack failed to compile:', error.stack || error)
            );

            if (error.details) {
                console.log(chalk.red('Webpack error details:', error.details));
            }

            return;
        }

        const info = stats.toJson();

        if (stats.hasErrors()) {
            console.log(chalk.red('Webpack stats errors:', info.errors));
        }

        if (stats.hasWarnings()) {
            console.log(chalk.yellow('Webpack stats warnings:', info.warnings));
        }

        console.log(stats.toString(config.stats));
        console.log(chalk.green('Production build compiled successfully!'));
    });
}

getUserConfig().then(result => {
    const userConfig = result ? result.config : null;

    if (userConfig) {
        console.log(chalk.green('rSR config loaded.'));
    }

    runWebpack(userConfig);
});
