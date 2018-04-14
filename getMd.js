const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const re = new RegExp("https://nodejs.org/api/.*\.html$");
const url = require('url');
const baseUrl = 'https://nodejs.org/api';
const outputPath = path.resolve(path.join(__dirname, 'docs','node','md'));

// maybe we should keep all api listings ?
const excludeList = [
    //'documentation',
    //'deprecation',
    //'synopsis',
];

request('https://nodejs.org/api/', (err, resp, body) => {

    const $ = cheerio.load(body);

    const docPaths = $('a[class*="nav-"]')
        .map(function(index, node) {
            return $(node).attr('href');
        }).filter(function(index, href) {
            return href.endsWith('.html');
        }).filter(function(index, href) {
            return !excludeList.some(excl => href.startsWith(excl));
        }).map(function(index, href) {
            return href.replace('.html','.md');
        }).get();

    docPaths.forEach(p => {
        request(`${baseUrl}/${p}`, (err, resp, body) => {
            if (err) throw err;
            console.log(`writing ${p} to ${outputPath}/${p} ... `); 
            fs.writeFile(`${outputPath}/${p}`, body, (err) => {
                if (err) throw err;
            });
        });
    })
});
