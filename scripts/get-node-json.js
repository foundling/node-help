const fs = require('fs');
const path = require('path');
const request = require('request');

const fullDocsUrl = "https://nodejs.org/api/all.json"; 
const filename = 'node-all.json';
const outputPath = path.resolve(path.join(__dirname, '..','docs','node'));

request(fullDocsUrl, (err, resp, body) => {
    if (err) throw err;
    
    fs.writeFile(path.join(outputPath, filename), body, 'utf8', (err) => {
        if (err) throw err;
    });

});
