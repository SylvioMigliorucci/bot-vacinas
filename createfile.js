const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const csv = require("csvtojson");
const { promisify } = require('util');
const results = [];
// const DateFns = require('date-fns');
var getMonth = require('date-fns/getMonth')
// const CSV = promisify(csv)
const { getDates } = require('./getDates')

async function CreateFile(){

  console.log('create file')
  const file =  fs.createWriteStream('file.csv')
  const {archiveDate, year, month, fulldate} = await getDates();
  console.log('This now dates:',archiveDate, fulldate);
  
  return new Promise((resolve, reject) => {
    return http.get(`https://www.saopaulo.sp.gov.br/wp-content/uploads/${year}/${month}/${archiveDate}_vacinometro.csv`, function(response) {
      // console.log(response);
      response.pipe(file);

      file.on('finish', () => {
        resolve(true);
      })
    })
  }); 
  
  
  
}


module.exports = {
  CreateFile
}
