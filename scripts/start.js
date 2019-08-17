process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const chalk = require('chalk');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const getUserConfig = require('./utils/get-user-config');
const getWebpackConfig = require('./utils/get-webpack-config');

function runDevServer(userConfig) {
    const {devServer, config} = getWebpackConfig({
        webpack,
        mode: 'development',
        userConfig,
    });
    const compiler = webpack(config);
    const server = new WebpackDevServer(compiler, devServer);

    server.listen(devServer.port);
}

getUserConfig().then(result => {
    const userConfig = result ? result.config : null;

    if (userConfig) {
        console.log(chalk.green('rSR config loaded.'));
    }

    runDevServer(userConfig);
});
