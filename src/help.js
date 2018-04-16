const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const { nodeToDocString } = require(path.resolve(__dirname, 'format'));
const { flatten, capitalize } = require(path.resolve(__dirname, 'utils'));


function help(token, docs) {

    const docTrees = findDocTrees(docs);
    const segments = token.split('.');
    const treeResults = docTrees
        .map(tree => find(tree, segments, 0))
    const docString = flatten(treeResults, depth=2).map(node => nodeToDocString(node)).join('\n');

    return docString;

}

function adjustSearchToken(token) {
    // to account for inconsistency with globals in in api docs

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

function findDocTrees(docs) {

    let mainTree = {
        methods: docs.methods, 
        modules: docs.modules, 
        globals: docs.globals,
        classes: docs.classes,
    };

    let errorsTree = docs.miscs.filter(node => node.name === 'Errors')[0];
    let globalObjectsTree = docs.miscs.filter(node => node.name === 'Global Objects')[0];
    
    return [mainTree, errorsTree, globalObjectsTree].filter(Boolean);
}

function find(root, segments, index) {

    const props = ['classes','events','globals','methods','miscs','modules','properties']; 

    // get current segment
    let segment = adjustSearchToken(segments[index]);

    // map root to target props values and flatten array
    let children = flatten(props.map(key => root[key]).filter(Boolean));

    let matches = children.filter(nameFilter(segment));

    // if no matches or we've processed the last segment, we're done
    if (!matches.length || index + 1 >= segments.length)
        return matches;

    // todo:return matches, not matches[0]
    return find(matches, segments, index + 1);

}

module.exports = exports = { help, find };
