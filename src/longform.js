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

    if (topicNames.length)
       return;

    return readdirPromise(mdDir)
        .then(files => {
            topicNames = files
                            .filter(fname => fname.endsWith('.md'))
                            .map(fname => path.basename(fname)
                            .split('.')[0]);
        })
        .catch(e => { throw e});

}

function listArticles() {
    const listHeader = `${chalk.red('available Node.js docs')}`; 
    const listBody = topicNames.map(name => `+ ${chalk.green(name)}`).join('\n');

    console.log(listHeader);
    console.log(listBody);
}

function renderArticle(topic) {

    if (!topicNames.includes(topic)) {
        console.log(`${chalk.green(`Sorry, ${topic} is not an available topic. Type '.docs' for a list of available topics.`)}`);
        return;
    }

    const articlePath = path.join(mdDir, `${topic}.md`);
    readFilePromise(articlePath, 'utf8')
        .then(content => console.log('\n\n' + marked(stripHTMLComments(content))))
        .catch(err => {
            throw err;
        });
}

module.exports = exports = { 
    listArticles, 
    renderArticle, 
    cacheTopicNames 
};
