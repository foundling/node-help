const fs = require('fs');
const chalk = require('chalk');
const path = require('path');
const { capitalize, decodeHTML, flatten, keys, striptags  } = require(path.resolve(__dirname, 'utils'));

function formatDocs(node, containsModules=false) {

    if (!node)
        return `${chalk.bgBlue('No documentation found!')}`;

    const {name, type, desc} = node;
    let signatures=[''];

    if (node.signatures) {
        signatures = flatten(node.signatures.map(o => o.params.map(p => p.textRaw))).filter(Boolean);
    }
    const sections = [
        `${chalk.bgBlue('Name:')} ${chalk.red(name)}`,
        `${chalk.bgBlue('Type:')} ${chalk.red(type)}`,
        `${chalk.bgBlue('Signature(s):\n')}${chalk.red(node.textRaw + '\n' + signatures.join('\n'))}`,
        `${chalk.bgBlue('Description:\n')}${chalk.red(striptags(decodeHTML(desc)))}`,
    ];
    return sections.join('\n');
}

function help(token, docTree) {

    const containsModules = node => node && node.modules && node.modules.length;
    const segments = token.split('.');
    const nodes = traverse(docTree, segments, 0);
    return nodes
            .map(n => formatDocs(n, containsModules(n)))
            .join('\n*******\n'); 

}

function traverse(root, segments, index) {

    const props = ['classes','events','globals','methods','modules']; 

    // get current segment
    let segment = segments[index];

    // map root to target props values and flatten array
    let children = flatten(props.map(key => root[key]).filter(Boolean));

    // keep children whose name property fuzzy matches the current segment
    // NOTE: modules with classes have moduleName.className value for name property
    let targets = children.filter(c => c.name === segment || c.textRaw === segment || c.displayName === segment || c.name.endsWith(`.${segment}`));

    if (index + 1 >= segments.length)
        // for now, return first match.
        return targets;
    else
        return traverse(targets[0], segments, index + 1);

}

module.exports = exports = { help, traverse };
