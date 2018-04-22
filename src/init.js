const cheerio = require('cheerio');
const chalk = require('chalk');
const path = require('path');

const { 

    flagThrown,
    mkdirpPromise,
    now, 
    readdirPromise, 
    readFilePromise, 
    requestPromise, 
    writeFilePromise, 

} = require(path.join(__dirname, 'utils'));

const CONFIG_PATH = path.join(__dirname, '..', 'config.json');
const PACKAGE_JSON_PATH = path.join(__dirname, '..', 'package.json');
const NODE_DOCS_BASE_URL = "https://nodejs.org/api";
const NODE_API_JSON_URL = "https://nodejs.org/api/all.json";
const NODE_API_JSON_PATH = path.join(__dirname,'docs','node','node-all.json');
const NODE_API_MD_DIR = path.join(__dirname,'docs','node','md');
const BANNER_PATH = path.join(__dirname,'banner.txt');
const ONE_WEEK_MS = 1000 * 60 * 60 * 24 * 7;
const newConfig = () => {
    const conf = {
        LAST_UPDATED_MS: now(),
        PROMPT: 'node-help > '
    };
    return JSON.stringify(conf);
}; 

function main() {

    return mkdirpPromise(NODE_API_MD_DIR)
            .then(() => getConfig(CONFIG_PATH)
                         .then(config => collectInitData(config, checkForUpdate(process.argv))));

}

function checkForUpdate(args) {
    const appArgs = args.slice(2);
    return flagThrown(appArgs, 'update');
}

function collectInitData({ isNew, config }, updateDocs) {

    // turn bin arg parse stuff into a module, parse args when needed
    const updateNeeded = isNew || updateDocs || now() - config.LAST_UPDATED_MS > ONE_WEEK_MS;
    const pkgJson = readFilePromise(PACKAGE_JSON_PATH).then(JSON.parse);
    const banner = getBanner(BANNER_PATH);
    const apiDocs = updateNeeded ? 
                    updateNodeAPIDocs(NODE_API_JSON_URL, NODE_API_JSON_PATH) : 
                    getNodeAPIDocs(NODE_API_JSON_URL, NODE_API_JSON_PATH);
    const mdDocs = updateNeeded ? 
                    updateNodeMDDocs(NODE_API_MD_DIR, NODE_DOCS_BASE_URL) : 
                    getMDDocs(NODE_API_MD_DIR);

    return Promise
            .all([
                config,
                pkgJson,
                banner,
                apiDocs,
                mdDocs,
            ])
            .catch(e => { throw e; });
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
    console.log(chalk.green('updating node API documentation ... '));
    return requestPromise(NODE_API_JSON_URL)
        .then(({ body }) => {
            return writeFilePromise(NODE_API_JSON_PATH, body, 'utf8')
                    .then(() => { 
                        console.log(chalk.green('node API documentation updated'));
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
