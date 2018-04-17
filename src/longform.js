const chalk = require('chalk');
const path = require('path');
const os = require('os');
const util = require('util');
const fs = require('fs');
const marked = require('marked');
const TerminalRenderer = require('marked-terminal');
const stripHTMLComments = require('strip-html-comments');
const mdDir = path.resolve(path.join(__dirname,'..','docs','node','md')); 
const readFile = util.promisify(fs.readFile); 
let articleNames;

function init() {

    marked.setOptions({
        renderer: new TerminalRenderer()
    });

    fs.readdir(mdDir, readArticleNames);

}

function readArticleNames(err, files) {
    if (err) throw err;
    articleNames = files
        .filter(fname => fname.endsWith('.md'))
        .map(fname => path.basename(fname).split('.')[0]);
}

function listArticles() {
    const listHeader = `${chalk.red('available Node.js docs')}`; 
    const listBody = articleNames.map(name => `+ ${chalk.green(name)}`).join('\n');

    console.log(listHeader);
    console.log(listBody);
}

function renderArticle(topic) {

    if (!articleNames.includes(topic))
        return console.log(`${chalk.green(`Sorry, ${topic} is not an available topic! Type '.longform' for a list of available topics.`)}`);

    const articlePath = path.join(mdDir, `${topic}.md`);
    fs.readFile(articlePath, 'utf8', (err, content) => {
        if (err) throw err;
        console.log(marked(stripHTMLComments(content)));
    });
}

init();
module.exports = exports = { listArticles, renderArticle };
