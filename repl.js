const r = require('repl');
const help = require('./help');
const vm = require('vm');
const prompt = 'node-help > ';

function helpFilter(cmd, context, filename, callback) {

    // if there are 1 or more tokens that end with '?', concat all their helptexts
    // otherwise, just eval the line

    let tokens = cmd.trim().split(' ');
    let helpTokens = tokens.filter(t => t.endsWith('?'));
    let rmLastChar = s => s.slice(0,-1);
    let buildHelp = token => help(rmLastChar(token));
    let output;

    if (helpTokens.length) 
        console.log(helpTokens.map(buildHelp).join('\n'));
        //helpTokens.map(buildHelp).join('\n');
    else
        output = vm.runInThisContext(cmd);

    callback(null, output);

}

r.start({ 

    prompt, 
    eval: helpFilter, 
    ignoreUndefined: true, 
    useGlobal: true,

});
