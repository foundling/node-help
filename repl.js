const r = require('repl');
const prompt = '> ';
const vm = require('vm');

function help(token) {
    return `help(${token})`;
}

function helpFilter(cmd, context, filename, callback) {

    if (cmd.trim().endsWith('?'))
        return callback(null, help(cmd.trim().slice(0,-1)));

    callback(null, vm.runInThisContext(cmd));
}

function writer(token) {

    return token.endsWith('?') ? help(token) : token.slice(0,-1);

}

r.start({ prompt, eval: helpFilter });
