const fs = require('fs');
const chalk = require('chalk');

module.exports = () => {
    const pkgFile = `${process.cwd()}/package.json`;

    fs.readFile(pkgFile, {encoding: 'utf8'}, (readError, data) => {
        if (readError) {
            console.log(chalk.red(readError));
        }

        const jsonData = JSON.parse(data);
        const startScript = 'rsr -e start';
        const buildScript = 'rsr -e build';
        let msg = 'You have existing scripts that rSR will overwrite.';
        let willOverride = false;

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

            console.log(chalk.green('Scripts added to package.json.'));
        });
    });
};
