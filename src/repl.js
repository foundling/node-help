const repl = require('repl');
const path = require('path');
const vm = require('vm');

const { help } = require('./help');
const { striptags, rmLastChar  } = require(path.resolve(__dirname, 'utils'));

function makeHelpFilter(docTree) {

    return function(cmd, context, filename, callback) {

        // if there are 1 or more tokens that end with '?', concat all their helptexts
        // otherwise, just eval the line

        let tokens = cmd.trim().split(' ');
        let helpTokens = tokens.filter(t => t.endsWith('?'));
        let buildHelp = token => help(rmLastChar(token), docTree);
        let output;

        if (helpTokens.length) 
            console.log(helpTokens.map(buildHelp).join('\n'));
        else
            output = vm.runInThisContext(cmd);

        callback(null, output);

    };

}

function start(docs) {

    repl.start({ 
        prompt: 'node-help > ', 
        eval: makeHelpFilter(docs), 
        ignoreUndefined: true, 
        useGlobal: true,
    });

}

module.exports = exports = { start };
