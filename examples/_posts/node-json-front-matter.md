{{{
    "title" : "JSON Front Matter in Node",
    "tags"  : [ "node", "json" ],
    "category" : "node",
    "date" : "7-20-2012"
}}}

Extract JSON front matter from strings and files in the style of [Jekyll's YAML Front Matter](https://github.com/mojombo/jekyll/wiki/YAML-Front-Matter).

### Installing

* `npm install json-front-matter`

### Methods

* `parse( s )` Parses string `s`, returning an object with properties `attributes`, containing the JSON front matter, and `body` containing the rest.
* `parseFile( path, callback( err, data ))` Parses file at `path`, calling the callback upon completion with `data` object containing `attribuets` and `body`, like the string parse method.

### Usage

```javascript
var fm = require('json-front-matter');

var string = '{{{ "title" : "some title", "array" : [ 1, 2, 3 ] }}} bodybodybody';
var out = fm.parse( string );

console.log( out.body ) // 'bodybodybody'
console.log( out.attributes.title ) // 'some title'
console.log( out.attributes.array ) // [ 1, 2, 3 ]
```

### File Example

See [./tests/data/test.md](https://raw.github.com/jsantell/node-json-front-matter/master/tests/data/test.md) for example of JSON Front Matter in a markdown file. The outer JSON is encapsulated via triple curly brackets. `{{{ "tags" : [ 'rock', 'paper', 'scissors' ] }}}`

Testing
---

Run `node tests/runTests.js` from project root -- testing uses `nodeunit`
