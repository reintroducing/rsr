/* eslint-disable no-console */
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ncp = require('ncp');
const {install} = require('pkg-install');
const updatePkg = require('./utils/pkg-scripts');
const pkgJson = require('../package.json');

inquirer
    .prompt([
        {
            message: 'Add necessary package scripts?',
            type: 'confirm',
            name: 'scripts',
            default: true,
        },
        {
            message: `Choose which config files to scaffold:`,
            type: 'checkbox',
            name: 'configs',
            choices: [
                {name: '.editorconfig', checked: true},
                {name: '.gitignore', checked: true},
                {name: '.npmrc', checked: true},
                {name: '.nvmrc', checked: false},
                {name: '.prettierignore', checked: true},
            ],
        },
        {
            message: 'Scaffold the suggested project files?',
            type: 'confirm',
            name: 'project',
            default: true,
        },
        {
            message: 'Install npm dependencies?',
            type: 'confirm',
            name: 'deps',
            default: true,
        },
    ])
    .then(answers => {
        if (answers.scripts) {
            updatePkg();
        }

        answers.configs.forEach(answer => {
            const src =
                answer === '.gitignore' || answer === '.npmrc'
                    ? answer.replace('.', '')
                    : answer;

            ncp(
                path.resolve(__dirname, `../templates/dotfiles/${src}`),
                `${process.cwd()}/${answer}`,
                error => {
                    if (error) {
                        return console.log(
                            chalk.red(`Could not scaffold ${answer}:`, error)
                        );
                    }

                    console.log(
                        chalk.green(
                            `Scaffolded ${answer} to your project's root.`
                        )
                    );
                }
            );
        });

        if (answers.project) {
            ncp(
                path.resolve(__dirname, '../templates/src'),
                `${process.cwd()}/src`,
                error => {
                    if (error) {
                        return console.log(
                            chalk.red(
                                'Could not scaffold project files:',
                                error
                            )
                        );
                    }

                    console.log(
                        chalk.green('Project files scaffolded successfully.')
                    );
                }
            );
        }

        if (answers.deps) {
            (async () => {
                console.log(chalk.green('Installing npm dependencies...'));

                const {stdout} = await install(pkgJson.peerDependencies, {
                    prefer: 'npm',
                    stdio: ['pipe', process.stdout, process.stderr],
                });

                console.log('Finished installing npm dependencies.', stdout);
            })();
        }
    });
