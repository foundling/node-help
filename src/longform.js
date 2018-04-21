const chalk = require('chalk');
const path = require('path');

const {
    readFilePromise,
    readdirPromise
} = require(path.join(__dirname, 'utils'));

const marked = require('marked');
const TerminalRenderer = require('marked-terminal');
const stripHTMLComments = require('strip-html-comments');
const mdDir = path.join(__dirname,'..','src','docs','node','md'); 

let topicNames;

marked.setOptions({
    renderer: new TerminalRenderer()
});

function cacheTopicNames() {

    if (topicNames && topicNames.length)
       return;

    return readdirPromise(mdDir)
        .then(files => {
            topicNames = files
                            .filter(fname => fname.endsWith('.md'))
                            .map(fname => path.basename(fname)
                            .split('.')[0]);
        })
        .catch(e => { throw e });

}

function listArticles() {
    const listHeader = `${chalk.red('available Node.js docs')}`; 
    const listBody = topicNames.map(name => `+ ${chalk.green(name)}`).join('\n');

    console.log(listHeader);
    console.log(listBody);
}

function printMarkdown(content) {
    const output = marked(stripHTMLComments(content));
    console.log(`\n\n${output}`);
}

function renderArticle(topic) {

    if (!topicNames.includes(topic)) {

        const output = chalk.green(`Sorry, ${topic} is not an available topic. Type '.docs' for a list of available topics.`);
        return console.log(output);
    }

    const articlePath = path.join(mdDir, `${topic}.md`);

    readFilePromise(articlePath, 'utf8')
        .then(printMarkdown)
        .catch(err => {
            throw err;
        });
}

module.exports = exports = { 
    listArticles, 
    renderArticle, 
    cacheTopicNames 
};
