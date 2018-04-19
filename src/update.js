const chalk = require('chalk');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const request = require('request');

const mdOutputPath = path.join(__dirname, '..','src','docs','node','md');
const JSONOutputPath = path.join(__dirname,'..','src','docs','node');
const nodeAPIUrl = 'https://nodejs.org/api';
const fullJSONDocsUrl = "https://nodejs.org/api/all.json"; 
const JSONOutputFilename = 'node-all.json';

function updateNodeJSON(callback) {
    request(fullJSONDocsUrl, (err, resp, body) => {
        if (err) 
            return callback(err);
        
        fs.writeFile(path.join(JSONOutputPath, JSONOutputFilename), body, 'utf8', (err) => {
            return callback(err, 'Node.js JSON docs updated!');
        });
    });
}

function updateNodeMd(callback) {
    request('https://nodejs.org/api/', (err, resp, body) => {

        const $ = cheerio.load(body);
        const docPaths = $('a[class*="nav-"]')
            .map((index, node) => $(node).attr('href'))
            .filter((index, href) => href.endsWith('.html'))
            .map((index, href) => href.replace('.html','.md'))
            .get();

        docPaths.forEach((docPath,i) => {
            request(`${nodeAPIUrl}/${docPath}`, (err, resp, body) => {
                if (err) return callback(err);
                fs.writeFile(`${mdOutputPath}/${docPath}`, body, (err) => {
                    if (err) return callback(err);
                    if (i >= docPaths.length - 1)
                       return callback(err, 'Node.js Markdown docs updated!'); 
                });
            });
        })

    });
}

module.exports = exports = { 
    updateNodeJSON: promisify(updateNodeJSON), 
    updateNodeMd: promisify(updateNodeMd)
};
