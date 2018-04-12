const r = require('repl');
const prompt = '> ';
const vm = require('vm');

function help(token) {
    return `help(${token})`;
}

function helpFilter(cmd, context, filename, callback) {

    let token = cmd.trim();
    let output = token.endsWith('?') ? help(token.slice(0,-1)) : vm.runInThisContext(token) 

    callback(null, output);
}

function writer(token) {

    return token.endsWith('?') ? help(token) : token.slice(0,-1);

}

r.start({ prompt, eval: helpFilter });
