process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

const chalk = require('chalk');
const webpack = require('webpack');
const webpackConfig = require('../config/webpack.config');

const config = webpackConfig('production');
const compiler = webpack(config);

console.log(chalk.green('Webpack is compiling your project for production. Please be patient, this may take a few minutes...'));

webpack(config, (error, stats) => {
    if (error) {
        console.log(chalk.red('Webpack failed to compile:', error.stack || error));

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
