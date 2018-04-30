# node-help

[![Known Vulnerabilities](https://snyk.io/test/github/foundling/node-help/badge.svg?targetFile=package.json)](https://snyk.io/test/github/foundling/node-help?targetFile=package.json)
[![Build Status](https://travis-ci.org/foundling/node-help.svg?branch=master)](https://travis-ci.org/foundling/node-help)

Offline documentation for your Node REPL.

### Installation

To install `node-help`, run: 

````
npm install -g node-help
````

### API

+ `?`: append to the end of a built-in Node object to get documentation on it
+ `.docs`: show a list of long-form markdown articles to read
+ `.docs <topic>`: render the article name in Markdown for the terminal 

## The offline documentation module for the Node.js REPL 

+ [Features](#features)
+ [Level of Support](#level-of-support)
+ [API](#api)
+ [Usage](#usage)
  - [The `.docs` command](#the--docs--command)
  - [The `.docs <topic>` command](#the--docs--topic---command)
  - [The `?` token](#the-----token)
+ [Contributions](#contributions)

### Features

`node-help` is a custom Node.js REPL inspired by iPython that lets you append a question mark to any valid JavaScript token to get information about it.

- Documentation for un-aliased built-in lookups, e.g. `node-help > process.env?`.
- Basic Native JavaScript introspection support displaying objects' valueOf(), toString(), method and property values.
- Colorized short-and-longform documentation
    + short-form docs are accessed with an appended `?` and are rendered in colorized plain text 
    + long-form docs are accessed via the `.docs <topic_name>` command and are rendered in colorized markdown in the terminal
- Command history and `global` context are enabled.

### Level of Support

At present documentation is available for Node v8, v9 and 10. Native JavaScript documentation is coming soon, but there is rudimentary introspection for Native JavaScript objects (See the 'additional information' section of the output for any given search query'). 

### Usage 


#### The `.docs` command

### The `?` token to search the Node API (shorter-form)

![question mark token](https://github.com/foundling/node-help/blob/master/media/node-help-question-mark.gif)

Using the `.docs` command, you can list the available longform docs like this:

![.docs command demo](https://github.com/foundling/node-help/blob/master/media/node-help-docs-main.gif)

#### The `.docs <topic>` command

By running `.docs process`, for example, you can read long-form documentation on the `http2` module from the Node.js website as colorized Markdown in your terminal. Like, wee!

![.docs with argument demo](https://github.com/foundling/node-help/blob/master/media/node-help-docs-dw.gif)

### Contributions

See [Contributing](https://github.com/foundling/node-help/blob/master/CONTRIBUTING.md). The search algorithm for `node-help` is not perfect so there will be bugs.  Please feel free to raise issues on the [github issues page](https://github.com/foundling/node-help/issues).
