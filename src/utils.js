const striptags = require('striptags');
const Entities = require('html-entities');


const capitalize = s => s[0].toUpperCase() + s.slice(1).toLowerCase();
const { decode } = new Entities.AllHtmlEntities();
//const flatten = a => a.reduce((acc, val) => acc.concat(val), []);
const rmLastChar = s => s.slice(0,-1);

function flatten(a, depth=1) {

    return depth <= 0 ? a : flatten(a.reduce((acc, val) => acc.concat(val), []), depth - 1);
};

function clear() {
    'use strict';
    process.stdout.write('\x1Bc');
}

function dedupe(arr) {
    return Array.from(new Set(arr));
}



module.exports = exports = {
    clear,
    capitalize,
    decodeHTML: decode,
    dedupe,
    flatten,
    keys: Object.keys,
    rmLastChar,
    striptags
};
