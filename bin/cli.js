#!/usr/bin/env node
const arg = require('arg');
const chalk = require('chalk');
const spawn = require('cross-spawn');

const args = arg({
    '--event': String,  // rsr --event=start
    '-e': '--event',    // rsr -e start
});
const script = args['--event'];

switch (script) {
    case 'start':
    case 'test':
    case 'build':
        spawn.sync(
            'node',
            [require.resolve(`../scripts/${script}`)],
            {stdio: 'inherit'}
        );
        break;

    default:
        console.log(chalk.red(`The script ${script} does not exist.`));
        break;
}
