const max = ns => ns.reduce((acc, n) => n > acc ? n : acc,0);
const sum = items => items.reduce((acc,x) => acc + x, 0);
const longest = items => max(items.map(i => i.length));

function subdivide(items, n=1) {

    let i = 0;
    let next;
    let result = [];

    if (n <= 1) 
        return [ items ];

    while (i < items.length ) {
        next = i + n;
        result.push(items.slice(i,next));
        i = next;
    }

    return result;

}


function zipLongest(...seqs) {

    let results = [];

    for (let i = 0; i < longest(seqs); ++i) {

        let a = [];

        for (let si = 0; si < seqs.length; ++si) {
            let item = seqs[si][i];
            if (item)
                a.push(seqs[si][i]);
        }

        results.push(a);

    }

    return results;

}


function padRight(s, max) {

    let n = max - s.length;

    if (n <= 0) 
        return s;

    while (n-- > 0) {
        s += ' ';
    }

    return s;

} 

function buildRow(row, columnWidth) {

    return row
            .map(item => padRight(item, columnWidth))
            .join('');

}

function columnize(items, displayWidth=process.stdout.columns) {

    if (!items.length)
        return 'none';

    items.sort();

    const columnWidth = longest(items) + 1;
    const nColumns = Math.floor(displayWidth/columnWidth);
    const nRows = Math.ceil(items.length/nColumns);

    // this accounts for the vertical sorting across columns
    const grid = subdivide(items, nRows);
    const transposedGrid = nRows === 1 ? 
                           grid : 
                           zipLongest(...grid); 

    const output = transposedGrid
                    .map(row => buildRow(row, columnWidth))
                    .join('\n');

    return '\n' + output;

}

module.exports = exports = { 

    columnize, 
    longest, 
    padRight, 
    subdivide, 
    zipLongest, 

};
