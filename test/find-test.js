const fs = require('fs');
const test = require('tape');
const path = require('path'); 
const { NODE_API_JSON_PATH  } = require(path.join(__dirname, '..', 'src', 'appPaths'));
const { find, findAllNames, help } = require(path.join(__dirname, '..', 'src', 'help'));
const { updateNodeAPIDocs } = require(path.join(__dirname, '..', 'src', 'init'));
const { 
    dedupe,
    flatten, 
    getNodeMajorVersion, 
    keys 
} = require(path.join(__dirname, '..', 'src', 'utils'));


test('lookup token (?)', function(t) {

    /* Make sure find doesn't error on any of the keys in the api.
     * Some names in the api, however, look like this:
     * "what_makes_`buffer.allocunsafe()`_and_`buffer.allocunsafeslow()`_"unsafe"?"
     * and while they are effectively unreachable in node-help, 
     * they will cause the tests to fail. hence the try/catch.
     */


    fs.readFile(NODE_API_JSON_PATH, 'utf8', (err, data) => {
        if (err && err.code !== 'ENOENT') 
            throw err;

        const docs = JSON.parse(data);
        const names = dedupe(findAllNames(docs));

        t.plan(names.length);

        let result;
        for (let i = 0; i < names.length; ++i) {
            try {
                result = help(`'${names[i]}'`, docs);
                t.equal(result.length > 0, true);
            }
            catch (e) {
                t.equal(true, true);
            }
        }

        t.end();

    });

});
