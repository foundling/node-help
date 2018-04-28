const path = require('path');
const { getNodeMajorVersion, getNodeDocsBaseURL } = require(path.join(__dirname,'utils'));

const MAJOR_VERSION = getNodeMajorVersion(process.version);
const NODE_DOCS_BASE_URL = getNodeDocsBaseURL(process.version); 
const NODE_API_JSON_URL = `${NODE_DOCS_BASE_URL}/all.json`;
const NODE_API_JSON_PATH = path.join(__dirname, 'docs', 'node', MAJOR_VERSION, 'all.json');
const NODE_API_MD_DIR = path.join(__dirname, 'docs', 'node', MAJOR_VERSION, 'md');

module.exports = exports = {
    
    // urls
    NODE_DOCS_BASE_URL,
    NODE_API_JSON_URL,

    // local doc paths
    NODE_API_JSON_PATH,
    NODE_API_MD_DIR,

    // config & static data
    CONFIG_PATH: path.join(__dirname, '..', 'config.json'),
    PACKAGE_JSON_PATH: path.join(__dirname, '..', 'package.json'),
    BANNER_PATH: path.join(__dirname,'banner.txt'),

};
