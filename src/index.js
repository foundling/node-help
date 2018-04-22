const path = require('path');
const chalk = require('chalk');

const repl = require(path.join(__dirname, 'repl')); 
const { progInfo } = require(path.join(__dirname, 'format'));
const { main }  = require(path.join(__dirname, 'init'));

function init() {

    main().then(startProg);

}

function startProg([config, pkgJson, banner, apiDocs, MDArticles] = args) {

    console.log(chalk.blue(banner));
    console.log(progInfo(pkgJson));
    repl.start(JSON.parse(apiDocs.docs));

}

module.exports = exports = init;
