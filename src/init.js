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
const nodeAPIDocsPath = path.join(__dirname,'docs','node','node-all.json');
const nodeMDDocsDir = path.join(__dirname,'docs','node','md');
const bannerPath = path.join(__dirname,'banner.txt');
const oneWeekMS = 1000 * 60 * 60 * 24 * 7;
const newConfig = () => `{ "lastUpdatedMS": ${ now() }  }`;

// if config
// read config
//      if cache out of date
//          update docs
// else
//      write default config.json to base dir

// if api docs
//      read api docs
//
// if md paths
//   read md paths
// otherwise 
//  get md files from node
//  write android apps
//
// read banner
// return them all to app


function getConfig(configPath) {

    return readFilePromise(configPath, 'utf8')
            .then(JSON.parse)
            .catch(e => {
                if (e.code === 'ENOENT')

                    // no config file, let's write one to disk and return a copy
                    return writeFilePromise(configPath, newConfig(), 'utf8')
                            .then(() => newConfig());

                throw e;
            });

}

function getNodeAPIDocs(nodeAPIDocsURL, nodeAPIDocsPath) {
    return readFilePromise(nodeAPIDocsPath, 'utf8')
        .catch(e => {
            if (e.code !== 'ENOENT')
                throw e;
            return updateNodeAPIDocs(nodeAPIDocsURL, nodeAPIDocsPath);
        });
}

function updateNodeAPIDocs(nodeAPIDocsURL, nodeAPIDocsPath) {
    return requestPromise(nodeAPIDocsURL)
        .then((resp, body) => {
           return writeFilePromise(nodeAPIDocsPath, body, 'utf8')
                    .then(() => 'Node.js JSON docs updated!');
        });
}

function updateNodeMDDocs(nodeMDDocsDir) {
    return listMDDocs(nodeMDDocsDir);
}

function listFiles(docsPath) {
    return readdirPromise(docsPath).then(docPaths => {
        return docPaths.filter(p => p.endsWith('.md'));
    });
}

function getMDDocs(nodeMDDocsDir) {
    return listFiles(nodeMDDocsDir)
            .then(docPaths => {
                const paths = docPaths.map(docPath => readFileSync(docPath, 'utf8'));
                return Promise.all(paths);
            });
}

function getAPIDocs(APIDocPath) {
    return readFileSync(APIDocPath, 'utf8');
}

// call these in request args
function writeMDDocs(MDDocs) {
    return writeFileSync(MDDocPath, MDDocs);
}

function writeAPIDocs(apiDocTree) {
    return writeFileSync(apiDocTree, MDDocs);
}

function getBanner(bPath) {
    return readFilePromise(bPath, 'utf8');
}

function main() {

    return getConfig(configPath)
        .then(config => {

            const updateDocs = now() - config.lastUpdatedMS > oneWeekMS;
            const banner = getBanner(bannerPath);
            const apiDocs = updateDocs ? 
                            updateNodeAPIDocs(nodeAPIDocsURL, nodeAPIDocsPath) : 
                            getNodeAPIDocs(nodeAPIDocsURL, nodeAPIDocsPath);
            const mdDocs = updateDocs ? 
                            updateNodeMDDocs(nodeMDDocsDir) : 
                            getMDDocs(nodeMDDocsDir);

            return mdDocs.then(console.log);
            return Promise
                    .all([
                        config,
                        banner,
                        apiDocs,
                        mdDocs,
                    ])
                    .catch(e => {
                        throw e;
                    });
        });

}

module.exports = exports = { main };
