const fs = require('fs');
const chalk = require('chalk');
const striptags = require('striptags');

const keys = Object.keys;
const docs = JSON.parse(fs.readFileSync('./docs/node/node-docs.json', 'utf8'));

const { 
    classes, 
    globals, 
    modules, 
    methods 
} = docs;

const moduleProps = ['name','desc','modules','methods','type'];
const isArray = x => x.constructor && x.constructor === Array;
const isObject = x => x.constructor && x.constructor === Object;

function processNode(node, target) {
    if (node.name === target) {
        moduleProps.forEach(t => console.log(`${t}: ${node[t]}`));
    } 
}

function traverse(node) {
    if (isArray(node)) {
        for (let i = 0; i < node.length; ++i) {
            traverse(node[i]);
        }
    } else if (isObject(node)) {
        if (node.modules) {
            traverse(node.modules);
        }
    }
}; 


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

// can this function be used for classes, modules, etc?
function find(tree, segments) {
    let si = 0;
    let node = tree; 
    let matches;

    while (node) {
        console.log(`segment: ${ segments[si] }, segmentIndex: ${ si }`);
        matches = node.filter(child => child.name === segments[si]);
        si++;

        // no match, we're done
        if (!matches.length) 
            return;

        // if we're at last segment path
        // return matches[0]
        if (si >= segments.length) 
            return matches[0];

        // no more paths to investigate. not a match
        if (!matches[0].modules || !matches[0].modules.length)
            return;
        else
            // more paths to match against modules
            node = matches[0].modules;
     }
}

function help(token) {

    const segments = token.split('.');
    const node = find(globals, segments) || find(methods, segments) || find(classes, segments) || find(modules, segments);
    const containsModules = node && node.modules && node.modules.length;

    return formatDocs(node, containsModules);
}

/* General Approach */

/* Break the command int segments, splitting on '.' 
 *
 * taking the first path, search through: 
 *      search globals, modules, classes, methods 
 *      compare against 'name' property
 *
 * if no match, nothing found. no support for 'assert.ok' if 
 * just 'ok' is entered. has to be fully qualified path.
 *
 * each time segment matches 'name' property in globals, modules, classes, methods 
 * go to next path segment and keep digging down into the tree, comparing against child 'name' properties 
 * if on last segment and 'name' matches segment name, get that object, pass to format
 *  if it's a module, format should print out the methods, properties, etc
 * otherwise: when no match for children, return 'not found'
 *
 */
/* cases:
 * help called on built by name: 
 *  assert?
 *  assert.ok.ok?
 *
 * help called on built in under different binding, e.g. B = Buffer, B?
 *
 *
 */

module.exports = exports = help;
