const cheerio = require('cheerio');
const path = require('path');

const { 

    now, 
    readdirPromise, 
    readFilePromise, 
    requestPromise, 
    writeFilePromise, 

} = require(path.join(__dirname, 'utils'));

const configPath = path.join(__dirname, '..', 'config.json');
const nodeAPIDocsURL = "https://nodejs.org/api/all.json";
const nodeAPIDocsBase = "https://nodejs.org/api";
const nodeAPIDocsPath = path.join(__dirname,'docs','node','node-all.json');
const nodeMDDocsDir = path.join(__dirname,'docs','node','md');
const bannerPath = path.join(__dirname,'banner.txt');
const oneWeekMS = 1000 * 60 * 60 * 24 * 7;
const newConfig = () => `{ "lastUpdatedMS": ${ now() }  }`;

function main({ update }) {

    return getConfig(configPath)
        .then(({ isNew, config }) => {

            const updateDocs = now() - config.lastUpdatedMS > oneWeekMS || isNew || update;

            const pkgJson = readFilePromise(path.join(__dirname,'..','package.json')).then(JSON.parse);
            const banner = getBanner(bannerPath);
            const apiDocs = updateDocs ? 
                            updateNodeAPIDocs(nodeAPIDocsURL, nodeAPIDocsPath) : 
                            getNodeAPIDocs(nodeAPIDocsURL, nodeAPIDocsPath);
            const mdDocs = updateDocs ? 
                            updateNodeMDDocs(nodeMDDocsDir, nodeAPIDocsBase) : 
                            getMDDocs(nodeMDDocsDir);

            return Promise
                    .all([
                        config,
                        pkgJson,
                        banner,
                        apiDocs,
                        mdDocs,
                    ])
                    .catch(e => { throw e; });
        });

}


function getConfig(configPath) {

    return readFilePromise(configPath, 'utf8')
        .then(data => {
            return { 
                isNew: false, 
                config: JSON.parse 
            };
        })
        .catch(e => {
            if (e.code !== 'ENOENT')
                throw e;

            // no config file, let's write one to disk and return a copy
            return writeFilePromise(configPath, newConfig(), 'utf8')
                .then(() => {
                    return {
                        config: newConfig(),
                        isNew: true
                    }
                });
        });

}

/* NODE API JSON DOC TREE */

function getNodeAPIDocs(nodeAPIDocsURL, nodeAPIDocsPath) {
    return readFilePromise(nodeAPIDocsPath, 'utf8')
        .then(docs => {
            return {
                isNew: false,
                docs
            };
        })
        .catch(e => {
            if (e.code !== 'ENOENT')
                throw e;
            return updateNodeAPIDocs(nodeAPIDocsURL, nodeAPIDocsPath);
        });
}

function updateNodeAPIDocs(nodeAPIDocsURL, nodeAPIDocsPath) {
    return requestPromise(nodeAPIDocsURL)
        .then(({ body }) => {
            return writeFilePromise(nodeAPIDocsPath, body, 'utf8')
                    .then(() => { 
                        return {
                            docs: body, 
                            msg: 'Node.js JSON docs updated!'
                        };
                    });
        });
}

/* NODE MARKDOWN DOCS */
function listMDFiles(docsPath) {
    return readdirPromise(docsPath).then(docPaths => {
        return docPaths.filter(p => p.endsWith('.md'));
    });
}

function updateNodeMDDocs(outputDir) {

    return requestPromise('https://nodejs.org/api').then(({body}) => {
    
            const $ = cheerio.load(body);
            const docPaths = $('a[class*="nav-"]')
                    .map((index, node) => $(node).attr('href'))
                    .filter((index, href) => href.endsWith('.html'))
                    .map((index, href) => href.replace('.html','.md'))
                    .get();
 
            // docpaths => request promises
            const docReqs = docPaths
                                .map(docPath => `${ nodeAPIDocsBase }/${ docPath }`)
                                .map(url => requestPromise(url));

            // resolve promises into html strings, 
            return Promise.all(docReqs)
                .then(responses => {
                    const docs = responses.map(r => r.body);
                    const docWrites = docs.map((doc, index) => writeFilePromise(`${outputDir}/${docPaths[index]}`, doc, 'utf8'));
                    return Promise.all(docWrites)
                        .then(() => {
                            return {
                                docs,
                                msg: 'Node.js longform docs updated!',
                            };
                        });
                });
    });
}

function getMDDocs(nodeMDDocsDir) {
    return listMDFiles(nodeMDDocsDir)
            .then(docPaths => {
                const docReads = docPaths.map(docPath => readFilePromise(docPath, 'utf8'));
                return Promise.all(docReads);
            });
}

// call these in request args
function writeMDDocs(MDDocs) {
    return writeFilePromise(MDDocPath, MDDocs);
}

function writeAPIDocs(apiDocTree) {
    return writeFilePromise(apiDocTree, MDDocs);
}

function getBanner(bPath) {
    return readFilePromise(bPath, 'utf8');
}

module.exports = exports = { main };
