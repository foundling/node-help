const fs = require('fs');
const chalk = require('chalk');
const striptags = require('striptags');

const keys = Object.keys;
const docTree = JSON.parse(fs.readFileSync('./docs/node/node-docs.json', 'utf8'));
//const docTree = JSON.parse(fs.readFileSync('./test.json', 'utf8'));

const { classes, globals, modules, methods } = docTree;

const moduleProps = ['name','desc','modules','methods','type'];
const isArray = x => x.constructor && x.constructor === Array;
const isObject = x => x.constructor && x.constructor === Object;
const equals = x => y => (x === y);

function formatModule(){
}

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

function capitalize(s) {
    return s[0].toUpperCase() + s.slice(1).toLowerCase()
} 

const flatten = a => a.reduce((acc, val) => acc.concat(val), []);

function find(children, segments) {

    /*
     * children is originally [modules, methods, classes, globals] 
     * while the segment index < segements length:
     *      we need to check current segment agains each array's contained objects name (in a lower case and capitalized way) 
     *      return all relevant results
     */


    // starting at top categories, iterate through token segments
    for (let i = 0; i < segments.length; ++i) {
        let seg = segments[i];    

        // iterate through categories
        for (let child = 0; child < children.length; ++child) {

            for (let j = 0; j < children[child].length; ++j) {
                //console.log(children[child][j]);
                return;
                //console.log(child[j].name, child[j].rawText, child[j].displayName);
            }   

        }
    }

    // we have processed the segments, what is our result?


}


function help(token) {

    const segments = token.split('.');
    const node = traverse(docTree, segments, 0);
    const containsModules = node && node.modules && node.modules.length;

    console.log(node);

    return formatDocs(node, containsModules);
}





function traverse(root, segments, index) {

    const props = ['globals','methods','properties','modules','classes']; 

    // get current segment
    let segment = segments[index];

    // map root to target props values and flatten array
    let children = flatten(props.map(key => root[key]).filter(Boolean));

    // keep children whose name property fuzzy matches the current segment
    let targets = children.filter(c => c.name === segment || c.textRaw === segment || c.displayName === segment);

    if (index + 1 >= segments.length)
        return targets[0];
    else
        return traverse(targets[0], segments, index + 1);

}


module.exports = exports = help;
