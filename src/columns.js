function splitBy(items, n) {

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

const max = ns => ns.reduce((acc, n) => n > acc ? n : acc,0);
const longest = items => max(items.map(i => i.length));

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
    return zipLongest(...splitBy(items, lineCount))
            .map(row => row.map(item => padRight(item, longestWord)).join('')).join('\n');
}

function sum(items) {
    return items.reduce((acc,x) => acc + x, 0);
}

function wrap(props) {
    const cols = process.stdout.columns;
    const termWidth = cols < 80 ? cols : 80;
    const rows = [[]];
    let len = 0;
    let rowIndex = 0;
    for (let i = 0; i < props.length; ++i) {
        if (sum(rows[rowIndex].map(item => (item + ' ').length)) + props[i].length >= termWidth)
            rows[++rowIndex] = [];
        rows[rowIndex].push(props[i]);
    }
    return '\n' + rows.map(row => row.join(' ')).join('\n');
}



function combinedLength(items) {
    return items.reduce((acc, item) => {
        return acc + (item + '\t').length;
    },0);
}


let items =  [
  'connecting',
  '_hadError',
  '_handle',
  '_parent',
  '_host',
  '_readableState',
  'readable',
  'domain',
  '_events',
  '_eventsCount',
  '_maxListeners',
  '_writableState',
  'writable',
  '_bytesDispatched',
  '_sockname',
  '_writev',
  '_pendingData',
  '_pendingEncoding',
  'allowHalfOpen',
  'server',
  '_server',
  'isRaw',
  'isTTY',
  'fd' 
];
console.log(columnize(items));
