const fs = require('fs');
const test = require('tape');
const path = require('path'); 
const { find } = require(path.resolve(path.join(__dirname,'..','src','help')));
const { keys, flatten } = require(path.resolve(path.join(__dirname,'..','src','utils')));
const docsPath = path.resolve(__dirname,'..','docs','node','node-all.json');

allnames = [];
const findAllNames = (root) => {

    const props = ['modules','methods','classes','globals','properties','miscs'];    
    const children = flatten(props.map(key => root[key]).filter(Boolean));
    const names = children.map(child => child.name);
    
    allnames = allnames.concat(names);

    if (!children.length)
        return allnames;

    return flatten(children.map(findAllNames));
}

test('lookup', function(t) {

    t.plan(1);

    fs.readFile(docsPath, 'utf8', (err, data) => {
        if (err) throw err;

        const docs = JSON.parse(data);
        const names = findAllNames(docs);
        console.log(Array.from(new Set(names)));
        t.equal(typeof docs, 'object'); 
        t.end();

    });

});
