/* eslint-disable no-console */
const fs = require('fs');
const chalk = require('chalk');

module.exports = () => {
    const pkgFile = `${process.cwd()}/package.json`;

    fs.readFile(pkgFile, {encoding: 'utf8'}, (readError, data) => {
        if (readError) {
            console.log(chalk.red(readError));
        }

        const jsonData = JSON.parse(data);
        const cleanScript = 'rm -rf dist || true';
        const startScript = 'npm run clean && rsr -e start';
        const buildScript = 'npm run clean && rsr -e build';
        let msg = 'You have existing scripts that rSR will overwrite.';
        let willOverride = false;

        if (jsonData.scripts.clean && jsonData.scripts.clean !== cleanScript) {
            msg += `\nCurrent "clean" script will be saved as "clean-backup".`;
            jsonData.scripts['clean-backup'] = jsonData.scripts.clean;
            willOverride = true;
        }

        jsonData.scripts.clean = cleanScript;

        if (jsonData.scripts.start && jsonData.scripts.start !== startScript) {
            msg += `\nCurrent "start" script will be saved as "start-backup".`;
            jsonData.scripts['start-backup'] = jsonData.scripts.start;
            willOverride = true;
        }

        jsonData.scripts.start = startScript;

        if (jsonData.scripts.build && jsonData.scripts.build !== buildScript) {
            msg += `\nCurrent "build" script will be saved as "build-backup".`;
            jsonData.scripts['build-backup'] = jsonData.scripts.build;
            willOverride = true;
        }

        jsonData.scripts.build = buildScript;

        if (willOverride) {
            console.log(chalk.red(msg));
        }

        fs.writeFile(pkgFile, JSON.stringify(jsonData, null, 2), writeError => {
            if (writeError) {
                return console.log(chalk.red(writeError));
            }

            console.log(chalk.green('rSR scripts added to package.json.'));
        });
    });
};
