const chalk = require('chalk');
const fs = require('fs');
const path = require('path');
const request = require('request');
const cheerio = require('cheerio');
const { promisify } = require('util');
const baseUrl = 'https://nodejs.org/api';
const outputPath = path.resolve(path.join(__dirname, '..','src','docs','node','md'));

function getNodeMd(callback) {

    request('https://nodejs.org/api/', (err, resp, body) => {

        const $ = cheerio.load(body);

        const docPaths = $('a[class*="nav-"]')
            .map((index, node) => $(node).attr('href'))
            .filter((index, href) => href.endsWith('.html'))
            .map((index, href) => href.replace('.html','.md'))
            .get();

        docPaths.forEach((p,i) => {
            request(`${baseUrl}/${p}`, (err, resp, body) => {
                if (err) 
                    callback(err);
                fs.writeFile(`${outputPath}/${p}`, body, (err) => {
                    if (err) 
                        callback(err);

                    console.log(chalk.green(`writing ${outputPath}/${p}`)); 
                    if (i === docPaths.length - 1) { 
                        console.log(chalk.green('Node.js markdown files updated'));
                        callback(null);
                    }
                });
            });
        })
    });
}

module.exports = exports = promisify(getNodeMd);
