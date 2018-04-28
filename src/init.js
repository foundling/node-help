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

const MAJOR_VERSION = getNodeMajorVersion(process.version);

function updateDocVersions() {

    // now that we've updated API docs, update config with updated versions  
    getConfig(CONFIG_PATH)
        .then(({config, isNew}) => {

            config.LAST_UPDATED_MS = now();
            config.VERSIONS.push(MAJOR_VERSION);

            updateConfig(CONFIG_PATH, config);

        });
}

function init() {

    return mkdirpPromise(NODE_API_MD_DIR)
            .then(() => {
                return getConfig(CONFIG_PATH)
                         .then(config => {
                             const appArgs = process.argv.slice(2);
                             const cliFlags = {
                                update: flagThrown(appArgs, 'update'),
                                noRun: flagThrown(appArgs, 'no-run')
                             };
                             return collectInitData(config, cliFlags);
                         });
            });
}

function newConfig() {
    return {
        LAST_UPDATED_MS: now(),
        PROMPT: '',
        VERSIONS: [],
    };
}; 

function oneWeekHasPassed(dateNowMS, dateCachedMS) {
    const ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7;
    return (dateNowMS - dateCachedMS) > ONE_WEEK_MS;
}

function collectInitData(configObj, flags) {

    const { config, isNew } = configObj;
    const noDocsForThisVersion = !config.VERSIONS.includes(MAJOR_VERSION);

    const updateNeeded = isNew || 
                         noDocsForThisVersion || 
                         flags.update || 
                         oneWeekHasPassed(now(), config.LAST_UPDATED_MS); 

    const pkgJson = readFilePromise(PACKAGE_JSON_PATH).then(JSON.parse);
    const banner = getBanner(BANNER_PATH);

    if (flags.update && flags.noRun) {
        return Promise
            .all([
                updateNodeAPIDocs(NODE_API_JSON_URL, NODE_API_JSON_PATH),
                updateNodeMDDocs(NODE_API_MD_DIR, NODE_DOCS_BASE_URL) 
            ])
            .then(() => { 
                process.exit(0) 
            });
    }

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

    console.log(chalk.green(`• Updating node API documentation for Node ${ MAJOR_VERSION } ... `));

    return requestPromise(NODE_API_JSON_URL)
        .then(({ body }) => {

            return writeFilePromise(NODE_API_JSON_PATH, body, 'utf8')
                    .then(() => { 

                        console.log(chalk.green(`• Node API documentation updated for Node ${ MAJOR_VERSION }!`));
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
            console.log(chalk.green(`• Updating longform documentation for Node ${ MAJOR_VERSION } ... `));
            return Promise.all(docReqs)
                .then(responses => {
                    const docs = responses.map(r => r.body);
                    const docWrites = docs.map((doc, index) => writeFilePromise(`${outputDir}/${docPaths[index]}`, doc, 'utf8'));
                    return Promise.all(docWrites)
                        .then(() => {

                            updateDocVersions();
                            console.log(chalk.green(`• Longform documentation updated for Node ${ MAJOR_VERSION }!`));

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

module.exports = exports = { 
    init,
    updateNodeAPIDocs,
    updateNodeMDDocs
};
