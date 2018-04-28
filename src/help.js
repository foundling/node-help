const chalk = require('chalk');
const path = require('path');
const vm = require('vm');

const { 
    formatES, 
    formatNodeJS, 
    summary 
} = require(path.join(__dirname, 'format'));

const { 
    capitalize, 
    dedupe, 
    flatten
} = require(path.join(__dirname, 'utils'));

function help(searchToken, docs) {

    const segments = searchToken.split('.');
    const lastSegment = segments.slice(-1)[0];
    const results = flatten(find(docs, lastSegment));
    const nodeJSDocStrings = dedupe(results
                                .map(result => formatNodeJS(result, searchToken)));

    const ESDocString = formatES(vm.runInThisContext(searchToken), searchToken);
    const resultsSummary = summary(nodeJSDocStrings.length) 
    const mergedDocStrings = [resultsSummary, nodeJSDocStrings.join('\n'), ESDocString].join('\n');

    return mergedDocStrings;

}

function findAllNames(tree) {

    const props = ['modules','methods','classes','globals','properties','miscs'];    
    const children = flatten(props.map(key => tree[key]).filter(Boolean));
    const names = children.map(child => child.name);
    
    if (children.length)
        return flatten(names.concat(children.map(findAllNames)));
    else 
        return names;
}

function find(root, segment) {
     
    const props = ['classes','events','globals','methods','miscs','modules','properties']; 

    if (root.name === segment)
        return root;

    let children = flatten(props.map(key => root[key])).filter(Boolean);
    return flatten(children.map(child => find(child, segment)));
    
}

module.exports = exports = { help, find, findAllNames };
