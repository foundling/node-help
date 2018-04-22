const path = require('path');

module.exports = exports = {
    
    NODE_DOCS_BASE_URL: "https://nodejs.org/api",
    NODE_API_JSON_URL: "https://nodejs.org/api/all.json",
    CONFIG_PATH: path.join(__dirname, '..', 'config.json'),
    PACKAGE_JSON_PATH: path.join(__dirname, '..', 'package.json'),
    NODE_API_JSON_PATH: path.join(__dirname,'docs','node','node-all.json'),
    NODE_API_MD_DIR: path.join(__dirname,'docs','node','md'),
    BANNER_PATH: path.join(__dirname,'banner.txt'),

};
