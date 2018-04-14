const fs = require('fs');
const test = require('tape');
const path = require('path'); 
const { traverse } = require(path.resolve(path.join(__dirname,'..','src','help')));
const docsPath = path.resolve(__dirname, '..', 'docs','node','node-all.json');


const keys = ['crypto','buffer','dns','net'];

test('lookup', function(t) {

    t.plan(1);

    fs.readFile(docsPath, 'utf8', (err, data) => {
        if (err) throw err;

        const docs = JSON.parse(data);
        t.equal(typeof docs, 'object'); 
        t.end();

    });

});
