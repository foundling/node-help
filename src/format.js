const chalk = require('chalk');
const path = require('path');
const util = require('util');
const striptags = require('striptags');
const { keys, flatten, decodeHTML } = require(path.resolve(__dirname, './utils'));

function getMethods(o) {
    const methods = keys(o)
        .map(k => o[k])
        .filter(Boolean)
        .filter(o => o.constructor && o.constructor.name === 'Function');

    return methods.length ? '\n' + methods.join('\n') : 'none';
}

function getOwnProperties(o) {
    const ownProps = Object.getOwnPropertyNames(o);
    return ownProps.length ? '\n' + ownProps.join('\n') : 'none';
}

function formatES(node, query) {

    return [
        `${chalk.bgWhite.black('Object Information')}`,
        `${chalk.green('toString:')} '${node.toString()}'`,
        `${chalk.green('valueOf:')} '${node.valueOf()}'`,
        `${chalk.green('Constructor:')} ${node.constructor.name}`,
        `${chalk.green('Own Properties:')} ${getOwnProperties(node)}`,
        `${chalk.green('Methods:')} ${getMethods(node)}`,
    ].join('\n');
}

function formatSignatures(signatures=[]) {
    const signatureArray = flatten(signatures.map(o => o.params.map(p => p.textRaw))).filter(Boolean);
    return signatureArray.length ? '\n' + signatureArray.join('\n') : '';
}
function formatDescription(desc) {
    return desc.trim().length ? '\n' + striptags(decodeHTML(desc)).trim() : '';
}

function formatNodeJS(node) {

    const {name, textRaw, type, desc, signatures} = node;
    const sections = [
        `${chalk.bgWhite.black('Node.js Documentation')}`,
        `${chalk.green('Name:')} ${name}`,
        `${chalk.green('Node.js Object Type:')} ${type}`,
        `${chalk.green('Signature(s):')} ${textRaw} ${formatSignatures(signatures)}`,
        `${chalk.green('Description:')} ${formatDescription(desc)}`,
    ];

    return sections.join('\n');

}

module.exports = exports = {
    formatNodeJS,
    formatES
};
