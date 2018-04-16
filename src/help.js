const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const { nodeToDocString } = require(path.resolve(__dirname, 'format'));
const { flatten, capitalize } = require(path.resolve(__dirname, 'utils'));


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
    const segments = token.split('.');
    const treeResults = docTrees
        .map(tree => find(tree, segments, 0))
    const docString = flatten(treeResults).map(node => nodeToDocString(node)).join('\n');

    return docString;

}

function adjustSearchToken(token) {
    // to account for globals weirdness in docs

    const toAdjust = ['process'];

    if (toAdjust.includes(token))
        return capitalize(token);

    return token;
}

function nameFilter(segment) {
    return function(node) {
        return node.name === segment || node.textRaw === segment || node.displayName === segment || node.name.endsWith(`.${segment}`);
    }
}

function find(root, segments, index) {

    const props = ['classes','events','globals','methods','miscs','modules','properties']; 

    // get current segment
    let segment = adjustSearchToken(segments[index]);

    // map root to target props values and flatten array
    let children = flatten(props.map(key => root[key]).filter(Boolean));

    // keep children whose name property fuzzy matches the current segment
    // NOTE: 
    //  - modules with classes have moduleName.className value for name property
    //  - 'process' module is in misc as 'Process'
    let targets = children.filter(nameFilter(segment));

    /*
    console.log('****');
    console.log(segment);
    console.log(targets);
    console.log('****');
    */


    // if targets is empty or if we're at last segment, then we're done
    if (!targets.length || index + 1 >= segments.length)
        return targets;

    return find(targets[0], segments, index + 1);

}

module.exports = exports = { help, find };
