const fs = require('fs');
const path = require('path');
const util = require('util');
const chalk = require('chalk');
const touch = require('touch');
const { homedir } = require('os');

const repl = require(path.join(__dirname, 'repl')); 
const { progInfo } = require(path.join(__dirname, 'format'));
const { clear, readFilePromise } = require(path.join(__dirname, 'utils'));
const { updateNodeJSON, updateNodeMd, checkConfig } = require(path.join(__dirname, 'update'));
const { main}  = require(path.join(__dirname, 'init'));
const packageJSON = path.join(__dirname,'..','package.json');
const bannerPath = path.join(__dirname, 'banner.txt'); 
const nodeDocsJSON = path.join(__dirname,'..','src','docs','node','node-all.json');

function init({ update }) {

    return main().then(startProg);

}

function startProg([config, banner, apiDocs, MDArticles] = args) {

    /*
    const updateMessages = [ JSONupdateMsg, markdownUpdateMsg ]
                            .filter(Boolean)
                            .map(msg => chalk.green(msg));
                           */ 

    clear();

    console.log(chalk.blue(banner));
    //console.log(progInfo(JSON.parse(pkgText)),'\n');
    //console.log(updateMessages.length ? `${ updateMessages.join('\n') }\n` : '');

    repl.start(JSON.parse(apiDocs));

}

module.exports = exports = init;
