const test = require('tape');
const path = require('path'); 
const { 
    dedupe,
    flagThrown,
    getNodeMajorVersion, 
    getNodeDocsBaseURL 
} = require(path.join(__dirname, '..', 'src', 'utils'));

test('dedupe', function(t) {

    t.plan(2);

    const a = [1,2,3,3,1];
    const b = [];

    t.deepEquals(dedupe(a), [1,2,3]);
    t.deepEquals(dedupe(b), []);

});

test('flagThrown', function(t) {

    t.plan(4);
    
    t.equals(flagThrown(['-u'],'update'), true);
    t.equals(flagThrown(['--update'],'update'), true);
    t.equals(!flagThrown(['u'],'update'), true);
    t.equals(!flagThrown(['update'],'update'), true);

});

test('getNodeMajorVersion', function(t) {

    t.plan(2);
    t.equals(getNodeMajorVersion('v8.11.1'), 'v8');
    t.equals(getNodeMajorVersion('v9.11.1'), 'v9');

});

test('getNodeDocsBaseURL', function(t) {

    t.plan(2);
    t.equals(getNodeDocsBaseURL('v8.11.1'), `https://nodejs.org/dist/latest-v8.x/docs/api`);
    t.equals(getNodeDocsBaseURL('v9.11.1'), `https://nodejs.org/dist/latest-v9.x/docs/api`);

})

