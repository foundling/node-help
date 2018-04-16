const chalk = require('chalk');
const path = require('path');
const util = require('util');
const striptags = require('striptags');
const { keys, flatten, decodeHTML } = require(path.resolve(__dirname, './utils'));
const formatters = {

    module: formatModule,
    method: formatMethod,
    property: formatProperty,
    class: formatClass,
    global: formatGlobal,
    default: formatDefault

};

function getMethods(o) {
    return keys(o)
        .filter(k => o[k].constructor.name === 'Function')
        .join('\n');
}
function getOwnProperties(o) {
    return Object.getOwnPropertyNames(o).join('\n');
}

function nodeToDocString(node, query) {

    if (node.type in formatters)
        return formatters[node.type](node, query);
    else
        return formatters['default'](node, query);

}

function formatDefault(node, query) {

    return [
        `${chalk.red('Query:')} '${query}'`,
        `${chalk.red('toString:')} '${node.toString()}'`,
        `${chalk.red('Constructor:')} ${node.constructor.name}`,
        `${chalk.red('Properties:')} \n${getOwnProperties(node)}`,
        `${chalk.red('Methods:')} \n${getMethods(node)}`,
    ].join('\n');
}

function formatModule(node) {

    let signatures = [''];
    const {name, type, desc} = node;

    if (node.signatures)
        signatures = flatten(node.signatures.map(o => o.params.map(p => p.textRaw))).filter(Boolean);

    const sections = [
        `${chalk.red('Query:')} '${query}'`,
        `${chalk.red('Name:')} ${name}`,
        `${chalk.red('Type:')} ${type}`,
        `${chalk.red('Signature(s):\n')}${node.textRaw + '\n' + signatures.join('\n')}`,
        `${chalk.red('Description:\n')}${striptags(decodeHTML(desc))})}`,
    ];

    return sections.join('\n');

}

function formatMethod(node) {

    let signatures = [''];
    const {name, type, desc} = node;

    if (node.signatures)
        signatures = flatten(node.signatures.map(o => o.params.map(p => p.textRaw))).filter(Boolean);

    const sections = [
        `${chalk.red('Query:')} '${query}'`,
        `${chalk.red('Name:')} ${name}`,
        `${chalk.red('Type:')} ${type}`,
        `${chalk.red('Signature(s):\n')}${node.textRaw + '\n' + signatures.join('\n')}`,
        `${chalk.red('Description:\n')}${striptags(decodeHTML(desc))}`,
    ];

    return sections.join('\n');

}

function formatProperty(node) {

    let signatures = [''];
    const {name, type, desc} = node;

    if (node.signatures)
        signatures = flatten(node.signatures.map(o => o.params.map(p => p.textRaw))).filter(Boolean);

    const sections = [
        `${chalk.red('Query:')} '${query}'`,
        `${chalk.red('Name:')} ${name}`,
        `${chalk.red('Type:')} ${type}`,
        `${chalk.red('Signature(s):\n')}${node.textRaw + '\n' + signatures.join('\n')}`,
        `${chalk.red('Description:\n')}${striptags(decodeHTML(desc))}`
    ];

    return sections.join('\n');

}

function formatClass(node) {

    let signatures = [''];
    const {name, type, desc} = node;

    if (node.signatures)
        signatures = flatten(node.signatures.map(o => o.params.map(p => p.textRaw))).filter(Boolean);

    const sections = [
        `${chalk.red('Query:')} '${query}'`,
        `${chalk.red('Name:')} ${name}`,
        `${chalk.red('Type:')} ${type}`,
        `${chalk.red('Signature(s):\n')}${node.textRaw + '\n' + signatures.join('\n')}`,
        `${chalk.red('Description:\n')}${striptags(decodeHTML(desc))}`,
    ];

    return sections.join('\n');

}

function formatGlobal(node) {

    let signatures = [''];
    const {name, type, desc} = node;

    if (node.signatures)
        signatures = flatten(node.signatures.map(o => o.params.map(p => p.textRaw))).filter(Boolean);

    const sections = [
        `${chalk.red('Query:')} '${query}'`,
        `${chalk.red('Name:')} ${name}`,
        `${chalk.red('Type:')} ${type}`,
        `${chalk.red('Signature(s):\n')}${node.textRaw + '\n' + signatures.join('\n')}`,
        `${chalk.red('Description:\n')}${striptags(decodeHTML(desc))}`,
    ];

    return sections.join('\n');


}

function notFound(token) {
    return 'No documentation found!';
}

module.exports = exports = { 

    nodeToDocString,
    formatters,

};
