const fs = require('fs');
const path = require('path');
const util = require('util');
const chalk = require('chalk');
const repl = require('./repl'); 
const progInfo = require('./progInfo');
const { clear } = require('./utils');
const readFilePromise = util.promisify(fs.readFile);

const packageJSON = path.resolve(path.join(__dirname,'..','package.json'));
const bannerPath = path.resolve(path.join(__dirname, 'banner.txt')); 
const nodeDocsJSON = path.resolve(path.join(__dirname,'..','docs','node','node-all.json'));

function startProg([pkgText, bannerText, nodeDocs]) {
    clear();
    console.log(chalk.blue(bannerText));
    console.log(progInfo(JSON.parse(pkgText)),'\n');
    repl.start(JSON.parse(nodeDocs));
}

function init (options) {

    const initData = [ 
        packageJSON, 
        bannerPath, 
        nodeDocsJSON 
    ].map(fpath => readFilePromise(fpath, 'utf8'));

    Promise.all(initData).then(startProg)

}


module.exports = exports = init;
