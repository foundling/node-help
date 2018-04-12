const request = require('request-promise-native');
const cheerio = require('cheerio');
const fs = require('fs');

let nodeUrl = 'https://nodejs.org/docs/latest-v9.x/api/all.json';
let mdnUrl = 'https://sanfrancisco.kapeli.com/feeds/zzz/mdn/JavaScript.tgz';

function success(data) {
    console.log(data);
}

function fail(e) {
    console.warn(e);
}

request(nodeUrl)
    .then(function(data) {
        fs.writeFile('./docs/node/node-docs.json', data, 'utf8', function(err) {
            if (err) throw err;
        });
    },fail)
    .catch(fail);

//request(mdnBaseUrl)
//    .then(success,fail)
//    .catch(fail);
//
