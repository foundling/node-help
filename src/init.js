const path = require('path');
const { readdirPromise, readFilePromise, writeFilePromise, now } = require(path.join(__dirname, 'utils'));
const newConfig = () => `{ "lastUpdatedMS": ${ now() }  }`;

// if config
// read config
//      if cache out of date
//          update
// else
//      write default config.json to base dir

// read api docs
// read md docs
// read config
// read banner
// return them all to app

function getConfig() {

    return readFilePromise(configPath, 'utf8', (err, configString) => {

        if (err) throw err;
        return JSON.parse(configString);

    })
    .catch(e => {

        if (e.code === 'ENOENT') {
            return writeFilePromise(configPath, config, 'utf8')
                .then(() => {
                    return newConfig();
                });
        }

        throw e;

    });

}

function listAPIDocs(docsDir) {
    return readdirPromise(docsDir);
}

function getMDDocs(docPaths) {

    return docPaths
        .map(docPath => readFileSync(docPath, 'utf8'));

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
