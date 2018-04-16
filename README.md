# node-help

### The *always-available* but not *always up-to-date* documentation module for your Node REPL 

`node-help` is a standalone command-line REPL that lets you append a question mark to any valid JavaScript token to get information it. It is inspired by iPython

Currently, only Node.js documentation is available. This means no `Array.prototype?`, etc., but JavaScript docs are coming soon.

With `node-help`, you can do this

````javascript
node-help > process.env?

````

and get this

````
query: 'process.env'
Name: env
Type: Object
Signature(s):
`env` {Object} 

Description:
The process.env property returns an object containing the user environment.
See environ(7).
An example of this object looks like:

{
  TERM: 'xterm-256color',
  SHELL: '/usr/local/bin/bash',
  USER: 'maciej',
  PATH: '~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin',
  PWD: '/Users/maciej',
  EDITOR: 'vim',
  SHLVL: '1',
  HOME: '/Users/maciej',
  LOGNAME: 'maciej',
  _: '/usr/local/bin/node'
}

It is possible to modify this object, but such modifications will not be
reflected outside the Node.js process. In other words, the following example
would not work:
$ node -e 'process.env.foo = "bar"' && echo $foo

While the following will:
process.env.foo = 'bar';
console.log(process.env.foo);

Assigning a property on process.env will implicitly convert the value
to a string.
Example:
process.env.test = null;
console.log(process.env.test);
// => 'null'
process.env.test = undefined;
console.log(process.env.test);
// => 'undefined'

Use delete to delete a property from process.env.
Example:
process.env.TEST = 1;
delete process.env.TEST;
console.log(process.env.TEST);
// => undefined

On Windows operating systems, environment variables are case-insensitive.
Example:
process.env.TEST = 1;
console.log(process.env.test);
// => 1


node-help > :w
evalmachine.<anonymous>:1
:w
^
````




# temp
