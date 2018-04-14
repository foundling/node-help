const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const repl = require('./repl'); 
const progInfo = require('./progInfo');
const bannerPath = path.resolve(path.join(__dirname,'banner.txt')); 
const packageJSON = path.resolve(path.join(__dirname,'..','package.json'));

/*
 * check for internet connection
 * figure out if doc check is necessary
 * echo banner, start repl
 *
 */

function init (options) {

    fs.readFile(packageJSON, 'utf8', (err, pkgText) => {
        if (err) throw err;


        fs.readFile(bannerPath, 'utf8', (err, bannerText) => {
            if (err) throw err;

            console.log(chalk.blue(bannerText));
            console.log(progInfo(JSON.parse(pkgText)));
            repl.start();

        });

    });


}


module.exports = exports = init;
