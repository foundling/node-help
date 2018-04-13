const request = require('request');
const marked = require('marked');
const TerminalRenderer = require('marked-terminal');
const stripHTMLComments = require('strip-html-comments');

marked.setOptions({
    renderer: new TerminalRenderer()
});

request('https://nodejs.org/api/buffer.md', (err, response, body) => {
    console.log(marked(stripHTMLComments(body)));
});
