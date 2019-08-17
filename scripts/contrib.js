const chalk = require('chalk');
const inquirer = require('inquirer');
const {install} = require('pkg-install');
const pkgJson = require('../package.json');

inquirer
    .prompt([
        {
            message: 'Install npm dependencies for local development?',
            type: 'confirm',
            name: 'scripts',
            default: true,
        },
    ])
    .then(answers => {
        if (answers.scripts) {
            (async () => {
                console.log(
                    chalk.green(
                        'Installing npm dependencies. This may take a few minutes...'
                    )
                );

                const {stdout} = await install(pkgJson.dependencies, {
                    prefer: 'npm',
                });

                console.log('Finished installing npm dependencies.', stdout);
            })();
        }
    });
