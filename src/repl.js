const path = require('path');
const repl = require('repl');
const replHistory = require('repl.history');
const touch = require('touch');
const vm = require('vm');
const { homedir } = require('os');

const { help } = require('./help');
const { listArticles, renderArticle } = require('./longform');
const { striptags, rmLastChar  } = require(path.resolve(__dirname, 'utils'));

function mkEval(dataTree) {

    return function(cmd, context, filename, callback) {

        // if there are 1 or more tokens that end with '?', concat all their helptexts
        // otherwise, just eval the line

        let tokens = cmd.trim().split(' ');
        let helpTokens = tokens.filter(t => t.endsWith('?'));
        let buildHelp = token => help(rmLastChar(token), dataTree);
        let output;

        if (helpTokens.length) 
            console.log(helpTokens.map(buildHelp).join('\n'));
        else
            output = vm.runInThisContext(cmd);

        callback(null, output);

    };

}

function start(dataTree) {

    const historyFile = path.join(homedir(),'.node_repl_history');

    const nr = repl.start({ 
        prompt: 'node-help > ', 
        eval: mkEval(dataTree), 
        ignoreUndefined: true, 
        useGlobal: true,
    });

    nr.defineCommand('docs',  {
        help: 'list available longform Node docs with `.longform` or read one with `.longform <topic>`.',
        action(topic) {
            this.clearBufferedCommand();
            if (!topic)
                console.log(listArticles())
            else
                renderArticle(topic);
            this.displayPrompt();
        }
    });

    replHistory(nr, historyFile);



}

module.exports = exports = { start };
