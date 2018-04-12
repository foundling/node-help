const fs = require('fs');

const keys = Object.keys;
const docs = JSON.parse(fs.readFileSync('./node-docs.json', 'utf8'));

const { 

    modules, 
    classes, 
    globals, 
    methods 

} = docs;

const displayModuleInfo = function(modules) {
    modules.forEach(m => {
        keys(m).forEach(k => {
            console.log(k);
            console.log(m[k]);
        })
    });
};

displayModuleInfo(modules);
