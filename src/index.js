const fs = require('fs');
const path = require('path');
const util = require('util');
const chalk = require('chalk');
const repl = require('./repl'); 
const progInfo = require('./progInfo');
const bannerPath = path.resolve(path.join(__dirname,'banner.txt')); 
const packageJSON = path.resolve(path.join(__dirname,'..','package.json'));
const readFilePromise = util.promisify(fs.readFile);


/*
 * check for internet connection
 * figure out if doc check is necessary
 * echo banner, start repl
 *
 */

function startProg(resolved) {
    const [ pkgText, bannerText ] = resolved;
    console.log(chalk.blue(bannerText));
    console.log(progInfo(JSON.parse(pkgText)));
    repl.start();
}

function init (options) {

    const initData = [readFilePromise(packageJSON, 'utf8'), readFilePromise(bannerPath, 'utf8')]; 
    Promise.all(initData)
        .then(startProg)

}


module.exports = exports = init;
