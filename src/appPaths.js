const path = require('path');
const { getNodeMajorVersion } = require(path.join(__dirname,'utils'));

function getNodeDocsBaseURL(versionString) {
    const major = getNodeMajorVersion(versionString);
    return `https://nodejs.org/dist/latest-${ major }.x/docs/api`;
};


module.exports = exports = {
    
    // urls
    NODE_DOCS_BASE_URL: getNodeDocsBaseURL(process.version),
    NODE_API_JSON_URL: `${ getNodeDocsBaseURL(process.version) }/all.json`,

    // local doc paths
    NODE_API_JSON_PATH: path.join(__dirname,'docs','node',getNodeMajorVersion(process.version),'all.json'),
    NODE_API_MD_DIR: path.join(__dirname,'docs','node',getNodeMajorVersion(process.version),'md'),

    // config & static data
    CONFIG_PATH: path.join(__dirname, '..', 'config.json'),
    PACKAGE_JSON_PATH: path.join(__dirname, '..', 'package.json'),
    BANNER_PATH: path.join(__dirname,'banner.txt')

};
