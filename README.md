# node-help

## The offline documentation module for the Node REPL 

`node-help` is a standalone command-line REPL inspired by iPython that lets you append a question mark to any valid JavaScript token to get information about it.

#### Level of Support

At present documentation is only available for Node.js 8.11.1+. Native JavaScript documentation is coming soon, but there is rudimentary introspection for Native JavaScript objects (See the 'additional information' section of the output for any given search query'). 

#### Features

- Documentation for un-aliased built-in lookups, e.g. `node-help > process.env?`.
- Basic Native JavaScript introspection support displaying objects' valueOf(), toString(), method and property values.
- Colorized short-and-longform documentation
    + short-form docs are accessed with an appended `?` and are rendered in colorized plain text 
    + long-form docs are accessed via the `.docs <topic_name>` command and are rendered in colorized markdown in the terminal
- Command history and `global` context are enabled.


#### API

+ `?`: append to the end of a built-in Node object to get documentation on it
+ `.docs`: show a list of long-form markdown articles to read
+ `.docs <filename>`: render the article name in Markdown for the terminal 

#### Usage 


Using the `.docs` command, you can list the available longform docs like this:

````
available Node.js docs
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
+ globals
+ http
+ http2
+ https
+ inspector
+ intl
+ modules
+ n-api
+ net
+ os
+ path
+ perf_hooks
+ process
+ punycode
+ querystring
+ readline
+ repl
+ stream
+ string_decoder
+ synopsis
+ timers
+ tls
+ tracing
+ tty
+ url
+ util
+ v8
+ vm
+ zlib
````

Using the `?`, you can do this

````javascript
node-help > process.env?

````

and get this

````bash
node-help > process?

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
