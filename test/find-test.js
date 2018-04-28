const fs = require('fs');
const test = require('tape');
const path = require('path'); 
const { NODE_API_JSON_PATH  } = require(path.join(__dirname, '..', 'src', 'appPaths'));
const { help, find, findAllNames } = require(path.join(__dirname, '..', 'src', 'help'));
const { updateNodeAPIDocs } = require(path.join(__dirname, '..', 'src', 'init'));
const { 
    flatten, 
    getNodeMajorVersion, 
    keys 
} = require(path.join(__dirname, '..', 'src', 'utils'));


test('lookup token (?)', function(t) {

    t.plan(3);

    fs.readFile(NODE_API_JSON_PATH, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') 
            throw err;

        const docs = JSON.parse(data);

        t.equal(!!help('process', docs).length, true);
        t.equal(!!help('process.stdin', docs).length, true);
        t.equal(!!help('process.stdin.server', docs).length, true);

        t.end();

    });

});
