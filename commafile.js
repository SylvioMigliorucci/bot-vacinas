const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const csv = require("csvtojson");
const { promisify } = require('util');
const results = [];

// const CSV = promisify(csv)

async function CommaFile(){
  return fs.readFile('file.csv', 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }
    var result = data.replace(/;/g, ',');
  
    fs.writeFile('file.csv', result, 'utf8', function (err) {
       if (err) return console.log(err);
    });
  });
  
}

module.exports = {
  CommaFile
}
