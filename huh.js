const r = require('repl');
const help = require('./help');
const vm = require('vm');
const PROMPT = 'node-help > ';

function helpFilter(cmd, context, filename, callback) {
    let output = vm.runInThisContext(cmd);
    output.context = context;
    output.context.global = global;
    callback(null, output);
}

r.start({ prompt: PROMPT, eval: helpFilter, ignoreUndefined: true, useGlobal: true });
//eval: helpFilter,
