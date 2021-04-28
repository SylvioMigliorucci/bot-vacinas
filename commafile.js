const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const csv = require("csvtojson");
const { promisify } = require('util');
const results = [];

// const CSV = promisify(csv)

async function CommaFile(){
  console.log('Comma file')

  return new Promise((resolve, reject) => {
    fs.readFile('file.csv', 'utf8', function (err,data) {
      if (err) {
        console.log(err);
        return reject(err.message);
      }
      //console.log({data})
      var result = data.replace(/;/g, ',');

      //console.log({result});
    
      fs.writeFile('file.csv', result, 'utf8', function (err) {
         if (err) {
          console.log(err);
          return reject(err.message);
         }
         resolve(true);
      });
    });
  })
}

module.exports = {
  CommaFile
}
