const fs = require('fs');
const path = require('path');
const util = require('util');
const chalk = require('chalk');
const touch = require('touch');
const { homedir } = require('os');
const readFilePromise = util.promisify(fs.readFile);

const repl = require(path.join(__dirname,'repl')); 
const { progInfo } = require(path.join(__dirname,'format'));
const { clear } = require(path.join(__dirname,'utils'));

const packageJSON = path.join(__dirname,'..','package.json');
const bannerPath = path.join(__dirname, 'banner.txt'); 
const nodeDocsJSON = path.join(__dirname,'..','src','docs','node','node-all.json');

function startProg([pkgText, bannerText, nodeDocs]) {
    clear();
    console.log(chalk.blue(bannerText));
    console.log(progInfo(JSON.parse(pkgText)),'\n');
    repl.start(JSON.parse(nodeDocs));
}

function init () {

    const initData = [ 
        packageJSON, 
        bannerPath, 
        nodeDocsJSON 
    ].map(fpath => readFilePromise(fpath, 'utf8'));

    Promise
        .all(initData)
        .then(startProg, (e) => { console.log(`error: ${e}`) })
        .catch(e => { 
            throw e;
        }) 

}


module.exports = exports = init;
