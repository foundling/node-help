const path = require('path');
const chalk = require('chalk');

const repl = require(path.join(__dirname, 'repl')); 
const { progInfo } = require(path.join(__dirname, 'format'));
const { init }  = require(path.join(__dirname, 'init'));

function main() {

    init()
        .then(startProg);

}

function startProg([config, pkgJson, banner, apiDocs, mdArticles] = args) {

    console.log(chalk.blue(banner));
    console.log(progInfo(pkgJson));
    repl.start(JSON.parse(apiDocs.docs));

}

module.exports = exports = main;
