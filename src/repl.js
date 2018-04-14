const repl = require('repl');
const { help } = require('./help');
const vm = require('vm');
const prompt = 'node-help > ';

function makeHelpFilter(docTree) {

    return function(cmd, context, filename, callback) {

        // if there are 1 or more tokens that end with '?', concat all their helptexts
        // otherwise, just eval the line

        let tokens = cmd.trim().split(' ');
        let helpTokens = tokens.filter(t => t.endsWith('?'));
        let rmLastChar = s => s.slice(0,-1);
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
        prompt, 
        eval: makeHelpFilter(docs), 
        ignoreUndefined: true, 
        useGlobal: true,
    });

}

module.exports = exports = { start };
