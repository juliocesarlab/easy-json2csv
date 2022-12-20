
# easy-json2csv

Transform JSON into CSV file or stream


## Installing

Install with npm or yarn

```bash
  npm install easy-json2csv
    or
  yarn add easy-json2csv
```
    
## Getting Started

```javascript
import { CSV }  from "easy-json2csv";

const csv = new CSV();

const header = [
  { columnName: "lines", refersTo: "somePropertyName"}]

const body = [
  { somePropertyName: "line 1" },
  { somePropertyName: "line 2" },
  { somePropertyName: "line 3" },
];

```

### If you want a file 
```javascript
csv 
    .setHeader(header)
    .setBody(body)
    .setEncoding("utf8") //optional
    .write();
```

/* 
outputs a file containing:

displayName
line 1;
line 2;
line 3;
*/


### If you want a stream
```javascript

var myCsvStream = csv 
    .setHeader(header)
    .setBody(body)
    .writeAsStream({ encoding: "utf8", hasSpecialChars: true});





