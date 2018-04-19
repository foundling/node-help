const fs = require('fs');
const path = require('path');
const util = require('util');
const chalk = require('chalk');
const touch = require('touch');
const { homedir } = require('os');
const readFilePromise = util.promisify(fs.readFile);

const repl = require(path.join(__dirname, 'repl')); 
const { progInfo } = require(path.join(__dirname, 'format'));
const { clear } = require(path.join(__dirname, 'utils'));
const { updateNodeJSON, updateNodeMd } = require(path.join(__dirname, 'update'));

const packageJSON = path.join(__dirname,'..','package.json');
const bannerPath = path.join(__dirname, 'banner.txt'); 
const nodeDocsJSON = path.join(__dirname,'..','src','docs','node','node-all.json');

function startProg([JSONupdateMsg, markdownUpdateMsg, pkgText, bannerText, nodeDocs] = args) {

    const updateMessage = [
        JSONupdateMsg, 
        markdownUpdateMsg
    ]
    .filter(Boolean)
    .map(msg => chalk.green(msg))
    .join('\n');

    clear();
    console.log(chalk.blue(bannerText));
    console.log(progInfo(JSON.parse(pkgText)),'\n');
    console.log(updateMessage ? updateMessage + '\n' : '');
    repl.start(JSON.parse(nodeDocs));
}

function init ({ update, noRun }) {

    let updates = update ? [ updateNodeJSON(), updateNodeMd() ] : [null, null];
    if (update) {
        if (noRun) process.exit(0);
        console.log(chalk.green('updating documentation ... '));
    }

    const data = [ 
        packageJSON, 
        bannerPath, 
        nodeDocsJSON 
    ].map(fpath => readFilePromise(fpath, 'utf8'));

    Promise
        .all(updates.concat(data))
        .then(startProg, (e) => { console.log(`error: ${e}`) })
        .catch(e => { 
            throw e;
        }) 

}

module.exports = exports = init;
