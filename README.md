# node-help

### The offline documentation module for your Node REPL 

`node-help` is a standalone command-line REPL that lets you append a question mark to any valid JavaScript token to get information about it. It is inspired by iPython

Currently, only Node.js documentation is available with rudimentary introspection for Native JavaScript objects. JavaScript docs are coming soon !.

With `node-help`, you can do this

````javascript
node-help > process.env?

````

and get this

````
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




# temp
