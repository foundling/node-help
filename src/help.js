const fs = require('fs');
const chalk = require('chalk');
const vm = require('vm');
const path = require('path');
const util = require('util');
const { nodeToDocString, formatters } = require(path.resolve(__dirname, 'format'));
const { dedupe, flatten, capitalize } = require(path.resolve(__dirname, 'utils'));

function help(token, docs) {

    const segments = token.split('.');
    const docTrees = findDocTrees(docs);
    const treeResults = docTrees
                        .map(tree => find(tree, segments, 0))
    const docStrings = flatten(treeResults, depth=2)
                        .filter(Boolean)
                        .map(node => nodeToDocString(node, query=token));

    const mergedDocStrings = dedupe(docStrings).join('\n');

    return mergedDocStrings.length ? mergedDocStrings : formatters.default(vm.runInThisContext(token), token);

}

function findDocTrees(docs) {

    // adjust docs object to make it easier to search

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

function adjustSearchToken(token) {
    // to account for globals edge-case in api docs

    const toAdjust = ['process'];

    if (toAdjust.includes(token))
        return capitalize(token);

    return token;
}

function nameFilter(segment) {
    return function(node) {
        return node.name === segment || 
               node.textRaw === segment || 
               node.displayName === segment || 
               node.name.endsWith(`.${segment}`);
    }
}

function find(root, segments, index) {

    const props = ['classes','events','globals','methods','miscs','modules','properties']; 

    // get current segment
    let segment = adjustSearchToken(segments[index]);
    let matchesSegment = nameFilter(segment);

    // map root to target props values and flatten array
    let children = flatten(props.map(key => root[key]).filter(Boolean));
    let matches = children.filter(matchesSegment);

    if (index === 1) 
        util.inspect(matches);

    // thought: make this work correctly with matches, i.e., not indexing into [0].  


    // if no matches or we've processed the last segment, we're done
    if (!matches.length || index + 1 >= segments.length)
        return matches[0];


    // todo:return matches, not matches[0]
    return find(matches[0], segments, index + 1);

}

module.exports = exports = { help, find };
