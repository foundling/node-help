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

function init() {

    main().then(startProg);

}

function startProg([config, banner, apiDocs, MDArticles] = args) {

    console.log(chalk.blue(banner));
    repl.start(JSON.parse(apiDocs.docs));

}

module.exports = exports = init;
