const cheerio = require('cheerio');
const chalk = require('chalk');
const path = require('path');

const {

    CONFIG_PATH, 
    PACKAGE_JSON_PATH, 
    NODE_DOCS_BASE_URL, 
    NODE_API_JSON_URL,
    NODE_API_JSON_PATH, 
    NODE_API_MD_DIR,
    BANNER_PATH 

} = require(path.join(__dirname, 'appPaths'));

const { 

    flagThrown,
    mkdirpPromise,
    now,
    getNodeMajorVersion,
    readdirPromise,
    readFilePromise,
    requestPromise,
    updateConfig,
    writeFilePromise

} = require(path.join(__dirname, 'utils'));

const ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7;

function updateDocVersions() {

    // now that we've updated API docs, update config with updated versions  
    getConfig(CONFIG_PATH)
        .then(({config, isNew}) => {

            const majorVersion = getNodeMajorVersion(process.version);
            if (config.VERSIONS.includes(majorVersion))
                return;

            config.VERSIONS.push(majorVersion);
            updateConfig(CONFIG_PATH, config);

        });
}

function main() {

    return mkdirpPromise(NODE_API_MD_DIR)
            .then(() => getConfig(CONFIG_PATH)
                         .then(config => collectInitData(config, checkForUpdate(process.argv))));
}

function newConfig() {
    return {
        LAST_UPDATED_MS: now(),
        PROMPT: 'node-help > ',
        VERSIONS: [],
    };
}; 

function checkForUpdate(args) {
    const appArgs = args.slice(2);
    return flagThrown(appArgs, 'update');
}

function collectInitData({ config, isNew }, updateFlag) {

    const docVersion = getNodeMajorVersion(process.version);
    const docVersionDownloaded = config.VERSIONS.includes(docVersion);

    const updateNeeded = isNew || !docVersionDownloaded || updateFlag || now() - config.LAST_UPDATED_MS > ONE_WEEK_MS;
    const pkgJson = readFilePromise(PACKAGE_JSON_PATH).then(JSON.parse);
    const banner = getBanner(BANNER_PATH);
    const apiDocs = updateNeeded ? 
                    updateNodeAPIDocs(NODE_API_JSON_URL, NODE_API_JSON_PATH) : 
                    getNodeAPIDocs(NODE_API_JSON_URL, NODE_API_JSON_PATH);
    const mdDocs = updateNeeded ? 
                    updateNodeMDDocs(NODE_API_MD_DIR, NODE_DOCS_BASE_URL) : 
                    getMDDocs(NODE_API_MD_DIR);

    // data for application
    return Promise
            .all([
                config,
                pkgJson,
                banner,
                apiDocs,
                mdDocs,
            ]);
}


function getConfig(CONFIG_PATH) {

    return readFilePromise(CONFIG_PATH, 'utf8')
        .then(data => {
            return { 
                isNew: false, 
                config: JSON.parse(data) 
            };
        })
        .catch(e => {
            if (e.code !== 'ENOENT')
                throw e;

            let config = newConfig();
            return writeFilePromise(CONFIG_PATH, JSON.stringify(config), 'utf8')
                .then(() => {
                    return {
                        isNew: true,
                        config
                    }
                });
        });

}

/* NODE API JSON DOC TREE */

function getNodeAPIDocs(NODE_API_JSON_URL, NODE_API_JSON_PATH) {
    return readFilePromise(NODE_API_JSON_PATH, 'utf8')
        .then(docs => {
            return {
                isNew: false,
                docs
            };
        })
        .catch(e => {
            if (e.code !== 'ENOENT')
                throw e;
            return updateNodeAPIDocs(NODE_API_JSON_URL, NODE_API_JSON_PATH);
        });
}

function updateNodeAPIDocs(NODE_API_JSON_URL, NODE_API_JSON_PATH) {
    console.log(chalk.green('Updating node API documentation ... '));
    return requestPromise(NODE_API_JSON_URL)
        .then(({ body }) => {
            return writeFilePromise(NODE_API_JSON_PATH, body, 'utf8')
                    .then(() => { 
                        console.log(chalk.green('node API documentation updated'));

                        updateDocVersions();

                        return {
                            docs: body, 
                            msg: 'Node.js JSON docs updated!'
                        };
                    });
        });
}

/* NODE MARKDOWN DOCS */
function listMDFiles(NODE_API_MD_DIR) {
    return readdirPromise(NODE_API_MD_DIR).then(docPaths => {
        return docPaths.filter(p => p.endsWith('.md'));
    });
}

function updateNodeMDDocs(outputDir, NODE_DOCS_BASE_URL) {

    return requestPromise(NODE_DOCS_BASE_URL).then(({body}) => {
    
            const $ = cheerio.load(body);
            const docPaths = $('a[class*="nav-"]')
                    .map((index, node) => $(node).attr('href'))
                    .filter((index, href) => href.endsWith('.html'))
                    .map((index, href) => href.replace('.html','.md'))
                    .get();
 
            // docpaths => request promises
            const docReqs = docPaths
                                .map(docPath => `${ NODE_DOCS_BASE_URL }/${ docPath }`)
                                .map(url => requestPromise(url));

            // resolve promises into html strings, 
            console.log(chalk.green('updating longform documentation ... '));
            return Promise.all(docReqs)
                .then(responses => {
                    const docs = responses.map(r => r.body);
                    const docWrites = docs.map((doc, index) => writeFilePromise(`${outputDir}/${docPaths[index]}`, doc, 'utf8'));
                    return Promise.all(docWrites)
                        .then(() => {

                            updateDocVersions();

                            console.log(chalk.green('longform documentation updated!'));
                            return {
                                docs,
                                msg: 'Node.js longform docs updated!',
                            };
                        });
                });
    });
}

function getMDDocs(NODE_API_MD_DIR) {
    return listMDFiles(NODE_API_MD_DIR)
            .then(docPaths => {
                const docReads = docPaths
                    .map(docPath => path.join(NODE_API_MD_DIR, docPath))
                    .map(fullPath => readFilePromise(fullPath, 'utf8'));

                return Promise.all(docReads);
            })
            .catch(e => {
                throw e;
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
