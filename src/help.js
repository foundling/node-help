const fs = require('fs');
const chalk = require('chalk');
const vm = require('vm');
const path = require('path');
const util = require('util');
const { formatES, formatNodeJS, summary } = require(path.resolve(__dirname, 'format'));
const { dedupe, flatten, capitalize } = require(path.resolve(__dirname, 'utils'));

function help(searchToken, docs) {

    const segments = searchToken.split('.');
    const lastSegment = segments.slice(-1)[0];
    const results = flatten(find(docs, lastSegment));
    const nodeJSDocStrings = dedupe(results
                                .map(result => formatNodeJS(result, searchToken)));

    const ESDocString = formatES(vm.runInThisContext(searchToken), searchToken);
    const resultsSummary = summary(nodeJSDocStrings.length) 
    const mergedDocStrings = [resultsSummary, nodeJSDocStrings.join('\n\n'), ESDocString].join('\n\n');

    return mergedDocStrings;

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

function find(root, segment) {
     
    const props = ['classes','events','globals','methods','miscs','modules','properties']; 

    if (root.name === segment)
        return root;

    let children = flatten(props.map(key => root[key])).filter(Boolean);
    return flatten(children.map(child => find(child, segment)));
    
}

module.exports = exports = { help, find };
