const fs = require('fs');
const path = require('path');
const request = require('request');
const { promisify } = require('util');
const chalk = require('chalk');

const fullDocsUrl = "https://nodejs.org/api/all.json"; 
const filename = 'node-all.json';
const outputPath = path.resolve(path.join(__dirname,'..','src','docs','node'));

function getNodeJSON(callback) {

    request(fullDocsUrl, (err, resp, body) => {
        if (err) 
            callback(err);
        
        fs.writeFile(path.join(outputPath, filename), body, 'utf8', (err) => {
            if (err) 
                callback(err);
            else { 
                console.log(chalk.green('Node.js JSON docs updated.'));
                callback(null);
            }
        });

    });

}

module.exports = exports = promisify(getNodeJSON);
