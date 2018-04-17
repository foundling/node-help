const fs = require('fs');
const test = require('tape');
const path = require('path'); 
const { find } = require(path.resolve(path.join(__dirname,'..','src','help')));
const { keys, flatten } = require(path.resolve(path.join(__dirname,'..','src','utils')));
const docsPath = path.resolve(__dirname,'..','docs','node','node-all.json');

function findAllNames(tree) {

    const props = ['modules','methods','classes','globals','properties','miscs'];    
    const children = flatten(props.map(key => tree[key]).filter(Boolean));
    const names = children.map(child => child.name);
    
    if (children.length)
        return flatten(names.concat(children.map(findAllNames)));
    else 
        return names;
}

test('lookup', function(t) {

    t.plan(1);

    fs.readFile(docsPath, 'utf8', (err, data) => {
        if (err) throw err;

        const docs = JSON.parse(data);
        const names = findAllNames(docs);
        const deduped = Array.from(new Set(names)); 
        console.log(deduped);
        t.equal(Array.isArray(deduped), true); 
        t.end();

    });

});
