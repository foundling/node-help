const r = require('repl');
const vm = require('vm');
const PROMPT = 'node-help > ';

function help(token) {
    return `help(${token})`;
}

function helpFilter(cmd, context, filename, callback) {
    let token = cmd.trim();
    let helpFnCalled = token.endsWith('?');
    let output = helpFnCalled ? help(token.slice(0,-1)) : vm.runInThisContext(token) 
    callback(null, output);
}

r.start({ prompt: PROMPT, eval: helpFilter });
