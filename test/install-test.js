const { exec } = require('child_process');
const path = require('path');
const { rmdir, unlink, access } = require('fs');
const test = require('tape');
const util = require('util');

const accessPromise = util.promisify(access);
const rmdirPromise = util.promisify(rmdir);
const unlinkPromise = util.promisify(unlink);
const { 
    mkdirpPromise, 
    getNodeMajorVersion, 
    readdirPromise,
} = require(path.join(__dirname, '..', 'src', 'utils'));

const { 
    CONFIG_PATH,
    NODE_API_MD_DIR, 
    NODE_API_JSON_PATH,
    NODE_DOCS_BASE_DIR
} = require(path.join(__dirname, '..', 'src', 'appPaths'));


test('node-help docs installation', function(t) {

    t.plan(1);

    // base version dir for this node version exists
    const baseDirExists = accessPromise(NODE_DOCS_BASE_DIR)
                            .then(e => !Boolean(e));

    // md files exist
    // json api file exist
 
    const installChecks = [ baseDirExists ];

    Promise
        .all(installChecks)
        .then(results => {

            const completeSuccess = results.every(Boolean); 

            t.equal(completeSuccess, true);
            t.end();

        })
        .catch(e => {
            t.fail('test failed with error: ', e);
            t.end();
        });

});
