const chalk = require('chalk');
const path = require('path');
const util = require('util');
const striptags = require('striptags');
const { keys, flatten, decodeHTML } = require(path.resolve(__dirname, './utils'));

function getMethods(o) {
    const methods = keys(o)
        .filter(k => o[k] && o.hasOwnProperty(k) && typeof o[k] === 'function');

    return methods.length ? '\n' + methods.join('\n') : 'none';
}

function getOwnProperties(o) {
    const ownProps = Object.getOwnPropertyNames(o)
                        .filter(name => typeof o[name] !== 'function');
    return ownProps.length ? '\n' + ownProps.join('\n') : 'none';
}

function formatES(node, query) {

    return [
        `[ JS Object Summary ]\n`,
        `${chalk.green.underline('toString:')} '${node.toString()}'`,
        `${chalk.green.underline('valueOf:')} '${node.valueOf()}'`,
        `${chalk.green.underline('Constructor:')} ${node.constructor.name}`,
        `${chalk.green.underline('Own Properties (non-methods):')} ${getOwnProperties(node)}`,
        `${chalk.green.underline('Methods:')} ${getMethods(node)}\n`,
    ].join('\n'); 
}

function formatSignatures(signatures=[]) {
    const signatureArray = flatten(signatures.map(o => o.params.map(p => p.textRaw))).filter(Boolean);
    return signatureArray.length ? '\n' + signatureArray.join('\n') : '';
}
function formatDescription(desc) {
    return desc.trim().length ? '\n' + striptags(decodeHTML(desc)).trim() : '';
}

function formatNodeJS(node, searchToken) {

    const {name, textRaw, type, desc, signatures} = node;
    const sections = [
        `${node.type} | ${searchToken}`,
        `${chalk.green.underline('Name:')} ${name}`,
        `${chalk.green.underline('Node.js Object Type:')} ${type}`,
        `${chalk.green.underline('Signature(s):')} ${textRaw} ${formatSignatures(signatures)}`,
        `${chalk.green.underline('Description:')} ${formatDescription(desc)}`,
    ];

    return sections.join('\n');

}

module.exports = exports = {
    formatNodeJS,
    formatES
};
