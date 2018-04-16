const chalk = require('chalk');
const path = require('path');
const striptags = require('striptags');
const { flatten, decodeHTML } = require(path.resolve(__dirname, './utils'));
const formatters = {

    module: formatModule,
    method: formatMethod,
    property: formatProperty,
    class: formatClass,
    global: formatGlobal,
    default: formatDefault

};

function nodeToDocString(node, query) {

    if (!node)
        return notFound(node);

    if (node.type in formatters)
        return formatters[node.type](node);
    else
        return formatters['default'](node);

}

function formatDefault(node) {

    let signatures = [''];
    const {name, type, desc} = node;

    if (node.signatures)
        signatures = flatten(node.signatures.map(o => o.params.map(p => p.textRaw))).filter(Boolean);

    const sections = [
        `${chalk.red('Name:')} ${name}`,
        `${chalk.red('Type:')} ${type}`,
        `${chalk.red('Signature(s):\n')}${node.textRaw + '\n' + signatures.join('\n')}`,
        `${chalk.red('Description:\n')}${striptags(decodeHTML(desc))}`,
    ];

    return sections.join('\n');
}

function formatModule(node) {

    let signatures = [''];
    const {name, type, desc} = node;

    if (node.signatures)
        signatures = flatten(node.signatures.map(o => o.params.map(p => p.textRaw))).filter(Boolean);

    const sections = [
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
        `${chalk.red('Name:')} ${name}`,
        `${chalk.red('Type:')} ${type}`,
        `${chalk.red('Signature(s):\n')}${node.textRaw + '\n' + signatures.join('\n')}`,
        `${chalk.red('Description:\n')}${striptags(decodeHTML(desc))}`,
    ];

    return sections.join('\n');


}

function notFound(node) {
    return 'No documentation found!';
}

module.exports = exports = { 

    nodeToDocString,
    formatMethod,
    formatProperty,
    formatClass,
    formatGlobal,
    notFound,

};
