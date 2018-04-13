const fs = require('fs');
const chalk = require('chalk');
const striptags = require('striptags');

const keys = Object.keys;
const docTree = JSON.parse(fs.readFileSync('./docs/node/node-docs.json', 'utf8'));
//const docTree = JSON.parse(fs.readFileSync('./test.json', 'utf8'));

const { classes, globals, modules, methods } = docTree;

const moduleProps = ['name','desc','modules','methods','type'];
const isArray = x => x.constructor && x.constructor === Array;
const isObject = x => x.constructor && x.constructor === Object;
const equals = x => y => (x === y);

function formatModule(){
}

function formatDocs(node, containsModules=false) {

    if (!node)
        return `${chalk.bgBlue('No documentation found!')}`;

    const {name, type, desc} = node;
    let signatures=[''];

    if (node.signatures) {
        signatures = flatten(node.signatures.map(o => o.params.map(p => p.textRaw))).filter(Boolean);
        console.log(signatures);
    }
    const sections = [
        `${chalk.bgBlue('Name:')} ${chalk.red(name)}`,
        `${chalk.bgBlue('Type:')} ${chalk.red(type)}`,
        `${chalk.bgBlue('Signature(s):\n')}${chalk.red(node.textRaw + '\n' + signatures.join('\n'))}`,
        `${chalk.bgBlue('Description:\n')}${chalk.red(striptags(desc))}`,
    ];
    return sections.join('\n');
}

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1).toLowerCase()
} 

const flatten = a => a.reduce((acc, val) => acc.concat(val), []);

function help(token) {

    const segments = token.split('.');
    const node = traverse(docTree, segments, 0);
    const containsModules = node && node.modules && node.modules.length;

    return formatDocs(node, containsModules);
}





function traverse(root, segments, index) {

    const props = ['globals','methods','properties','modules','classes']; 

    // get current segment
    let segment = segments[index];

    // map root to target props values and flatten array
    let children = flatten(props.map(key => root[key]).filter(Boolean));

    // keep children whose name property fuzzy matches the current segment
    let targets = children.filter(c => c.name === segment || c.textRaw === segment || c.displayName === segment);

    if (index + 1 >= segments.length)
        // for now, return first match.
        return targets[0];
    else
        return traverse(targets[0], segments, index + 1);

}


module.exports = exports = help;
