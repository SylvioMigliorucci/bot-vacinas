const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const csv = require("csvtojson");
const { getDates } = require('./getDates');
const { resolve } = require('path');
const twitter = require = require('./twitter');

const infoCities = [
  {
    nome: 'ARAÇATUBA',
    populacao: 198087.57,
  },
  {
    nome: 'BIRIGUI',
    populacao: 124851.24,
  },
  {
    nome: 'GUARARAPES',
    populacao: 33109.49,
  },
  {
    nome: 'VALPARAÍSO',
    populacao: 26816.10,
  }
]

async function _getPercentage({city, doses}){
  const infoCity = infoCities.filter((item) => item.nome === city)
  console.log({doses})
  console.log({infocity: infoCity[0].populacao})
  return (Number(doses)*100) / Number(infoCity[0].populacao);
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
}

async function _getPrevRate( {city, doses}, dose ){  

  const data = new Promise((resolve, reject) => {
    fs.readFile('prevData.json', (err, data) => {
      if (err) return reject(err);
  
      return resolve(data);
  
    });
  });
  
  data.then(e => console.log("eeeeeeeeeeeee", e));
  console.log(data)

  return 'a';
}

async function _setPreviousData({result}) {

}

async function _getBodyContent({result, infoDate}){
  const percentagedose1 = await _getPercentage({city: result[0]['Município'], doses: result[0]['Total Doses Aplicadas']});
  const percentagedose2 = await _getPercentage({city: result[1]['Município'], doses: result[1]['Total Doses Aplicadas']});
  const prevRates1 = await _getPrevRate({city: result[0]['Município'], doses: result[0]['Total Doses Aplicadas']}, 0);
  const prevRates2 = await _getPrevRate({city: result[1]['Município'], doses: result[1]['Total Doses Aplicadas']}, 1);  
  
  console.log("prevRates2", prevRates2)

  return `Vacinação COVID-19 - ${capitalize(result[0]['Município'])} - Dia: ${infoDate}\n\n
  ${result[0].Dose}
  Doses Aplicadas: ${result[0]['Total Doses Aplicadas']} - Aprox.: ${percentagedose1.toFixed(2)}% da população \n\n 
  ${result[1].Dose}
  Doses Aplicadas: ${result[1]['Total Doses Aplicadas']} - Aprox.: ${percentagedose2.toFixed(2)}% da população
        
  \n\n\n Fonte: VacinaJa São Paulo` 
}


async function ReadFile(){
  console.log('Read file')
  const {archiveDate, year, month, fulldate, infoDate} = await getDates();
  console.log('This now dates:',archiveDate, fulldate);

  let previousData = [];

  try {
    const jsonObj = await csv().fromFile('file.csv')

    for (const city of infoCities) {
      const result =  jsonObj.filter(item => item['Município'] === city.nome).reverse()
      console.log(result.length)
      
      if(result.length === 0){
        console.log('arquivo não está disponivel')
      }else{
        // Armazenar dados da última consulta em um array e depois gravá-lo em um .json
        previousData.push({
          city: result[0]['Município'],
          doses: [
            result[0]['Total Doses Aplicadas'],
            result[1]['Total Doses Aplicadas'],
          ],
          date: infoDate
        });

        console.log('post');
        console.log(await _getBodyContent({result, infoDate}))

        const jsonData = await JSON.stringify(previousData);
        await fs.writeFileSync('prevData.json', jsonData);

        twitter.BotInit(await _getBodyContent({result, infoDate}))
      }
    }
  } catch (err) {
    console.log('Não possui informação por enquanto', err)
  }

}

module.exports = {
  ReadFile
}