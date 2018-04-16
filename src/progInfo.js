const path = require('path');
const chalk = require('chalk');

function progInfo(packageInfo) {

    const info = {
        ' node version ': process.version,
        ' node-help version ': packageInfo.version,
        ' github ': chalk.green(packageInfo.repository.url)
    };


    return Object.keys(info).map(k => {
        const prop = k;
        const value = info[k];
        return `${chalk.bgWhite.black(prop)} ${chalk.black(value)}`;
    }).join('\n');

}

module.exports = exports = progInfo;
