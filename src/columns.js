const max = ns => ns.reduce((acc, n) => n > acc ? n : acc,0);
const sum = items => items.reduce((acc,x) => acc + x, 0);
const longest = items => max(items.map(i => i.length));

function subdivide(items, n) {

    let i = 0;
    let next;
    let result = [];

    if (n <= 1) 
        return items;

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
            a.push(seqs[si][i] || '');
        }
        results.push(a);
    }
    return results;
}


function padRight(s, max) {

    let n = max - s.length;

    if (n <= 0) 
        return s;

    while (n-- >= 0) {
        s += ' ';
    }

    return s;

} 

function columnize(items, sep='  ') {

    items.sort();

    const longestWord = longest(items) + sep.length;
    const width = process.stdout.columns;
    const wordsPerLine = Math.floor(width/longestWord);
    const lineCount = Math.ceil(items.length/wordsPerLine);
    const rows = items;

    return zipLongest(...subdivide(items, lineCount))
            .map(row => {
                return row
                        .map(item => padRight(item, longestWord))
                        .join('')
            })
            .join('\n');
}

module.exports = exports = { 
    columnize 
};
