process.env.BABEL_ENV = 'development';
process.env.NODE_ENV = 'development';

const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfig = require('../config/webpack.config');

const {
    devServer,
    ...remainingConfig
} = webpackConfig();
const compiler = webpack(remainingConfig);
const server = new WebpackDevServer(compiler, devServer);
const port = 3000;

server.listen(3000, '127.0.0.1', () => {
    console.log('Starting server on http://localhost:3000');
});
