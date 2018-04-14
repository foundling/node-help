const striptags = require('striptags');
const Entities = require('html-entities');
const { decode } = new Entities.AllHtmlEntities();
const flatten = a => a.reduce((acc, val) => acc.concat(val), []);
const rmLastChar = s => s.slice(0,-1);

function clear() {
    'use strict';
    process.stdout.write('\x1Bc');
}



module.exports = exports = {
    clear,
    decodeHTML: decode,
    flatten,
    keys: Object.keys,
    rmLastChar,
    striptags
};
