const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const csv = require("csvtojson");
const { promisify } = require('util');
const {ReadFile} = require('./readfile');
const {CreateFile} = require('./createfile');
const {CommaFile} = require('./commafile');
const { setInterval, setTimeout } = require('timers');
const results = [];

(async () => {
  setTimeout(() =>{
    console.log('create file')
    CreateFile();
  }, 1000);
  setTimeout(() =>{
    console.log('Comma file')
    CommaFile();
  }, 2000)
  setTimeout(() => {
    console.log('Read file')
    ReadFile();
  }, (3000));
})();