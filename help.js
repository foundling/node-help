const fs = require('fs');

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


function formatDocs({name, type, desc}) {
    return `name: ${name}\ntype: ${type}\ndesc: ${desc}\n`;
}

function findGlobal(segment) {
    let match = globals.filter(g => g.name === segment);
    return (match.length) ? match[0] : null 
}

function help(token) {
    const segments = token.split('.');
    let match = 'no match';
    if (segments.length === 1) {
        match = findGlobal(segments[0]);
    }

    return formatDocs(match);
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
