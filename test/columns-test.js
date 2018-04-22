const test = require('tape');
const path = require('path'); 
const { columnize, subdivide, zipLongest, padRight } = require(path.join(__dirname, '..', 'src', 'columns'));

test('subdivide', function(t) {

    t.plan(6);

    t.deepEqual(subdivide( [],1 ), [[]] );
    t.deepEqual(subdivide( [],4 ), [] );

    t.deepEqual(subdivide( ['name','length','prototype'], 0 ), [['name','length','prototype']] );

    t.deepEqual(subdivide( [1,2,3],1 ), [[1,2,3]] );
    t.deepEqual(subdivide( [1,2,3],2 ), [[1,2],[3]] );
    t.deepEqual(subdivide( [1,2,3],3 ), [[1,2,3]] );

});

test('zipLongest', function(t) {

    t.plan(2);

    let r1 = zipLongest( [1,2,3,4], [5,6,7,8], [9,10,11] );  
    t.deepEqual(r1, [[1,5,9], [2,6,10], [3,7,11], [4,8]] );

    let r2 = zipLongest( [1,2,3] );  
    t.deepEqual(r2, [[1],[2],[3]]);

});
