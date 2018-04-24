const Entities = require('html-entities');
const fs = require('fs');
const { promisify } = require('util');
const striptags = require('striptags');

const capitalize = s => s[0].toUpperCase() + s.slice(1).toLowerCase();
const chop = s => s.slice(0, -1);
const { decode } = new Entities.AllHtmlEntities();

const readFilePromise = promisify(fs.readFile);
const writeFilePromise = promisify(fs.writeFile);
const readdirPromise = promisify(fs.readdir);
const requestPromise = promisify(require('request'));
const mkdirpPromise = promisify(require('mkdirp'));
const existsPromise = fs.exists;

function clear() {
    'use strict';
    process.stdout.write('\x1Bc');
}

function getNodeMajorVersion(versionString) {
    const [ major, minor, patch ] = versionString.split('.'); 
    return major;
};


function dedupe(arr) {
    return Array.from(new Set(arr));
}

function flagThrown(args, name) {
    let flags = [`-${name[0]}`,`--${name}`];
    return args.some(arg => flags.includes(arg));
}

function flatten(a, depth=1) {
    return depth <= 0 ? a : flatten(a.reduce((acc, val) => acc.concat(val), []), depth - 1);
};

function now() {
    return new Date().getTime();
}

function updateConfig(configPath, data) {
    return writeFilePromise(JSON.stringify(data, null, 2), configPath, 'utf8');
}


module.exports = exports = {
    capitalize,
    chop,
    clear,
    decodeHTML: decode,
    dedupe,
    existsPromise,
    flagThrown,
    flatten,
    getNodeMajorVersion,
    keys: Object.keys,
    mkdirpPromise,
    now,
    readdirPromise,
    requestPromise,
    readFilePromise,
    striptags,
    updateConfig,
    writeFilePromise,
};
