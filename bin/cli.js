#!/usr/bin/env node
/* eslint-disable no-console */
const arg = require('arg');
const chalk = require('chalk');
const spawn = require('cross-spawn');

function runScript(script) {
    spawn.sync('node', [require.resolve(`../scripts/${script}`)], {
        stdio: 'inherit',
    });
}

function determineScript(script) {
    if (script) {
        switch (script) {
            case 'start':
            case 'build':
            case 'contrib':
                runScript(script);
                break;

            default:
                console.log(chalk.red(`The script ${script} does not exist.`));
                break;
        }
    } else {
        // rsr ran with no params, initialize a project
        runScript('init');
    }
}

const args = arg({
    '--event': String, // rsr --event=start
    '-e': '--event', // rsr -e start
});
const script = args['--event'];

determineScript(script);
