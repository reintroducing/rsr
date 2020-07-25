const chalk = require('chalk');
const {cosmiconfig} = require('cosmiconfig');

const explorer = cosmiconfig('rsr');

function loadConfig(configPath) {
    return explorer.load(configPath);
}

function getUserConfig() {
    return explorer
        .search()
        .then(result => {
            if (!result) {
                console.log(
                    chalk.green(
                        'No rsr.config.js present, proceeding with default configuration.'
                    )
                );

                return Promise.resolve();
            }

            if (result && result.config) {
                const configType = typeof result.config;

                if (configType !== 'function') {
                    throw new Error(
                        `rSR config module must be a function but received ${configType} in "${result.filepath}"`
                    );
                }

                return loadConfig(result.filepath);
            }
        })
        .catch(error => {
            console.log(chalk.red('rSR failed to initialize:', error));
        });
}

module.exports = getUserConfig;
