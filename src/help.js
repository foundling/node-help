const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const { capitalize, decodeHTML, flatten, keys, striptags  } = require(path.resolve(__dirname, 'utils'));

function formatDocs(node, containsModules=false) {

    if (!node)
        return `${chalk.bgBlue('No documentation found!')}`;

    const {name, type, desc} = node;
    let signatures=[''];

    if (node.signatures)
        signatures = flatten(node.signatures.map(o => o.params.map(p => p.textRaw))).filter(Boolean);

    const sections = [
        `${chalk.bgBlue('Name:')} ${chalk.red(name)}`,
        `${chalk.bgBlue('Type:')} ${chalk.red(type)}`,
        `${chalk.bgBlue('Signature(s):\n')}${chalk.red(node.textRaw + '\n' + signatures.join('\n'))}`,
        `${chalk.bgBlue('Description:\n')}${chalk.red(striptags(decodeHTML(desc)))}`,
    ];

    return sections.join('\n');
}

function findDocTrees(docs) {

    let mainTree = {
        methods: docs.methods, 
        methods: docs.modules, 
        globals: docs.globals,
        classes: docs.classes,
    };

    let errorsTree = docs.miscs.filter(node => node.name === 'Errors')[0];
    let globalObjectsTree = docs.miscs.filter(node => node.name === 'Global Objects')[0];
    
    return [mainTree, errorsTree, globalObjectsTree].filter(Boolean);
}

function help(token, docs) {

    const docTrees = findDocTrees(docs);
    const containsModules = node => node && node.modules && node.modules.length;
    const segments = token.split('.');
    const treeResults = docTrees
        .map(tree => find(tree, segments, 0))
    const docString = flatten(treeResults).map(node => formatDocs(node, containsModules(node))).join('\n');

    return docString;

}

function find(root, segments, index) {

    const props = ['classes','events','globals','methods','miscs','modules','properties']; 

    // get current segment
    let segment = segments[index];

    // map root to target props values and flatten array
    let children = flatten(props.map(key => root[key]).filter(Boolean));

    // keep children whose name property fuzzy matches the current segment
    // NOTE: 
    //  - modules with classes have moduleName.className value for name property
    //  - 'process' module is in misc as 'Process'
    let targets = children.filter(c => c.name === segment || c.textRaw === segment || c.displayName === segment || c.name.endsWith(`.${segment}`));

    // if targets is empty or if we're at last segment, then we're done
    if (!targets.length || index + 1 >= segments.length)
        return targets;

    return find(targets[0], segments, index + 1);

}

module.exports = exports = { help, find };
