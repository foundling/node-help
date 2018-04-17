# node-help

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

`node-help` is a standalone command-line REPL inspired by iPython that lets you append a question mark to any valid JavaScript token to get information about it.

- Documentation for un-aliased built-in lookups, e.g. `node-help > process.env?`.
- Basic Native JavaScript introspection support displaying objects' valueOf(), toString(), method and property values.
- Colorized short-and-longform documentation
    + short-form docs are accessed with an appended `?` and are rendered in colorized plain text 
    + long-form docs are accessed via the `.docs <topic_name>` command and are rendered in colorized markdown in the terminal
- Command history and `global` context are enabled.

### Level of Support

At present documentation is only available for Node.js 8.11.1+. Native JavaScript documentation is coming soon, but there is rudimentary introspection for Native JavaScript objects (See the 'additional information' section of the output for any given search query'). 

### API

+ `?`: append to the end of a built-in Node object to get documentation on it
+ `.docs`: show a list of long-form markdown articles to read
+ `.docs <filename>`: render the article name in Markdown for the terminal 

### Usage 


#### The `.docs` command

Using the `.docs` command, you can list the available longform docs like this:

````
available Node.js docs:
+ addons
+ assert
+ async_hooks
+ buffer
+ child_process
+ cli
+ cluster
+ console
+ crypto
+ debugger
+ deprecations
+ dgram
+ dns
+ documentation
+ domain
+ errors
+ esm
+ events
+ fs
...
````

#### The `.docs <topic>` command

By running `.docs http2`, for example, you can read longform documentation on the `http2` module from the Node.js website as colorized Markdown in your terminal.

````javascript
# HTTP/2

    Stability: 1 - Experimental

    The http2 module provides an implementation of the HTTP/2 (https://tools.ietf.org/html/rfc7540) protocol. It
    can be accessed using:

        const http2 = require('http2');

        ## Core API

        The Core API provides a low-level interface designed specifically around
        support for HTTP/2 protocol features. It is specifically not designed for
        compatibility with the existing HTTP/1 (http.html) module API. However,
        the Compatibility API (#http2_compatibility_api) is.

        The http2 Core API is much more symmetric between client and server than the
        http API. For instance, most events, like error, connect and stream, can
        be emitted either by client-side code or server-side code.

        ### Server-side example

        The following illustrates a simple HTTP/2 server using the Core API.
        Since there are no browsers known that support
        unencrypted HTTP/2 (https://http2.github.io/faq/#does-http2-require-encryption), the use of
        http2.createSecureServer() (#http2_http2_createsecureserver_options_onrequesthandler) is necessary when communicating
        with browser clients.

            const http2 = require('http2');
                const fs = require('fs');

...
````

#### The `?` token

By appending a `?` to a Node builtin object, you can do this:

````javascript
node-help > process.env?

[ 2 Result(s) for Node.js. ]

global | process 
Name: process
Node.js Object Type: global
Signature(s): process 
Description: 
{Object}

The process object. See the process object section.

ChildProcess | process 
Name: process
Node.js Object Type: ChildProcess
Signature(s): `process` {ChildProcess}  
Description: 
All workers are created using child_process.fork(), the returned object
from this function is stored as .process. In a worker, the global process
is stored.
See: Child Process module
Note that workers will call process.exit(0) if the 'disconnect' event occurs
on process and .exitedAfterDisconnect is not true. This protects against
accidental disconnection.

[ Additional Information ]

toString: '[object process]'
valueOf: '[object process]'
Constructor: process
Own Properties (non-methods): 
title
version
versions
arch
platform
release
argv
execArgv
env
pid
features
ppid
execPath
debugPort
moduleLoadList
_events
_eventsCount
_maxListeners
domain
_exiting
config
stdout
stderr
stdin
argv0
mainModule
Methods: 
_startProfilerIdleNotifier
_stopProfilerIdleNotifier
_getActiveRequests
_getActiveHandles
reallyExit
abort
chdir
cwd
umask
getuid
geteuid
setuid
seteuid
setgid
setegid
getgid
getegid
getgroups
setgroups
initgroups
_kill
_debugProcess
_debugPause
_debugEnd
hrtime
cpuUsage
dlopen
uptime
memoryUsage
_rawDebug
binding
_linkedBinding
_fatalException
assert
setUncaughtExceptionCaptureCallback
hasUncaughtExceptionCaptureCallback
emitWarning
nextTick
_tickCallback
openStdin
exit
kill

````

### Contributions

The search algorithm for `node-help` is not perfect so there will be bugs.  Please feel free to raise issues on the [github issues page](https://github.com/foundling/node-help/issues).