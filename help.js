const fs = require('fs');
const chalk = require('chalk');
const striptags = require('striptags');

const keys = Object.keys;
const docs = JSON.parse(fs.readFileSync('./docs/node/node-docs.json', 'utf8'));

const { classes, globals, modules, methods } = docs;

const moduleProps = ['name','desc','modules','methods','type'];
const isArray = x => x.constructor && x.constructor === Array;
const isObject = x => x.constructor && x.constructor === Object;
const equals = x => y => (x === y);

function formatDocs(node, containsModules=false) {

    if (!node)
        return `${chalk.bgBlue('No documentation found!')}`;

    const {name, type, desc} = node;
    const sections = [
        `${chalk.bgBlue('Name:')} ${chalk.red(name)}`,
        `${chalk.bgBlue('Type:')} ${chalk.red(type)}`,
        `${chalk.bgBlue('Description:\n')}${chalk.red(striptags(desc))}`,
    ];
    return sections.join('\n');
}

function find(children, segments) {

    let si = 0;
    let match;
    let segment;

    const matchesNodeName = (child) => {
        return child.name === segments[si] || child.displayName === segments[si];
    };

    while (children && children.length) {

        segment = segments[si];
        console.log(segment);
        match = children.filter(matchesNodeName)[0];
        si++;

        // no match, we're done
        // no modules and we're not done with the paths, so we're done
        if (!match || !match.modules || !match.modules.length) 
            return;

        // if we're at last segment path, return first match
        // return match
        if (si >= segments.length) 
            return match;

        // more paths to match against modules
        children = match.modules;

    }

    return match; 

}

function help(token) {

    const segments = token.split('.');
    const node = find(modules, segments);
    const containsModules = node && node.modules && node.modules.length;

    return formatDocs(node, containsModules);
}

module.exports = exports = help;
