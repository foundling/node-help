const path = require('path');
const getNodeMd = require(path.resolve(path.join(__dirname,'get-node-md')));
const getNodeJSON = require(path.resolve(path.join(__dirname,'get-node-json')));
const nodeHelp = require(path.resolve(path.join(__dirname, '..', 'src')));

function success() {
    console.log('Update complete!');
    nodeHelp()
}

function failure(e) {
    throw e;
}

function run() {
    console.log('updating documentation ...');
    Promise
        .all([getNodeMd, getNodeJSON])
        .then(success, failure)
        .catch(e => { throw e });
};

module.exports = exports = run;
