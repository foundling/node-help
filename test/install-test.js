const { exec } = require('child_process');
const cheerio = require('cheerio');
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
    requestPromise,
} = require(path.join(__dirname, '..', 'src', 'utils'));

const { 
    CONFIG_PATH,
    NODE_API_MD_DIR, 
    NODE_API_JSON_PATH,
    NODE_DOCS_BASE_DIR,
    NODE_DOCS_BASE_URL
} = require(path.join(__dirname, '..', 'src', 'appPaths'));


// break into separate tests for basedir, md files, json api  
test('base docs dir exists', function(t) {

    t.plan(1);

    accessPromise(NODE_DOCS_BASE_DIR)
        .then(result => {
            t.equal(Boolean(result), false);
            t.end();
        })
        .catch(e => {
            if (e.code === 'ENOENT') {
                t.fail();
                t.end();
            }
            throw e;
        });

});

test('All markdown files have been retrieved.', function(t) {

    t.plan(1);

    requestPromise(NODE_DOCS_BASE_URL)
        .then(({ body }) => {

            // list of topics on website
            const $ = cheerio.load(body);
            const docPaths = $('a[class*="nav-"]')
                    .map((index, node) => $(node).attr('href'))
                    .filter((index, href) => href.endsWith('.html'))
                    .map((index, href) => href.replace('.html','.md'))
                    .get();

            // .md files found in local md directory
            return readdirPromise(NODE_API_MD_DIR)
                .then(filenames => {

                    filenames = filenames
                                    .filter(filename => filename.endsWith('.md'));

                    filenames.sort();
                    docPaths.sort();

                    t.deepEqual(docPaths, filenames);
                    t.end();

                })
                .catch(e => {
                    throw e;
                });

        });

});

test('all.json file exists', function(t) {

    accessPromise(NODE_API_JSON_PATH)
        .then(result => {
            t.equal(Boolean(result), false);
            t.end();
        })
        .catch(e => {
            if (e.code === 'ENOENT') {
                t.fail();
                t.end();
            }
            else 
                throw e;
        });

});
