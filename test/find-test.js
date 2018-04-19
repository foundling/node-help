const fs = require('fs');
const test = require('tape');
const path = require('path'); 
const { find, findAllNames } = require(path.join(__dirname,'..','src','help'));
const { keys, flatten } = require(path.join(__dirname,'..','src','utils'));
const docsPath = path.join(__dirname,'..','src','docs','node','node-all.json');


test('lookup', function(t) {

    t.plan(1);

    fs.readFile(docsPath, 'utf8', (err, data) => {
        if (err) throw err;

        const docs = JSON.parse(data);
        const names = findAllNames(docs);
        const deduped = Array.from(new Set(names)); 

        t.equal(Array.isArray(deduped), true); 
        t.end();

    });

});
