const chalk = require('chalk');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const request = require('request');

const { now, writeFilePromise, readFilePromise } = require(path.join(__dirname, '..','src','utils'));
const mdOutputPath = path.join(__dirname, '..','src','docs','node','md');
const JSONOutputPath = path.join(__dirname,'..','src','docs','node');
const nodeAPIUrl = 'https://nodejs.org/api';
const fullJSONDocsUrl = "https://nodejs.org/api/all.json"; 
const JSONOutputFilename = 'node-all.json';
const configPath = path.join(__dirname,'..','config.json');
const oneWeekMS = 1000 * 60 * 60 * 24 * 7;
const newConfig = () => `{ "lastUpdatedMS": ${ now() } }`;

function checkConfig(callback) {
    return readFilePromise(configPath,'utf8')
            .then(s => {
                const config = JSON.parse(s);
                const cacheExpired = now() - config.lastUpdatedMS >= oneWeekMS;

                if (cacheExpired)
                    return writeFilePromise(configPath, newConfig(), 'utf8').catch(e => { throw e }); 

            }) 
            .catch(e => {
                if (e.code === 'ENOENT')
                    return writeFilePromise(configPath, newConfig(), 'utf8').catch(e => { throw e }); 

            });
}

// use the promise version of request and writefilepromis
function updateNodeJSON(callback) {
    request(fullJSONDocsUrl, (err, resp, body) => {
        if (err) 
            return callback(err);
        
        fs.writeFile(path.join(JSONOutputPath, JSONOutputFilename), body, 'utf8', (err) => {
            return callback(err, 'Node.js JSON docs updated!');
        });
    });
}

// use the promise version of request with promise.all
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
    updateNodeMd: promisify(updateNodeMd),
    checkConfig
};
