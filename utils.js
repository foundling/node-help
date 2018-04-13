fs = require('fs');
keys = Object.keys;
flatten = a => a.reduce((acc, val) => acc.concat(val), []);
docTree = JSON.parse(fs.readFileSync('docs/node/node-docs.json','utf8'));
props = ['globals','methods','properties','modules','classes'];




