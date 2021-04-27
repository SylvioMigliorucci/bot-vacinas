const http = require('https'); // or 'https' for https:// URLs
const fs = require('fs');
const csv = require("csvtojson");
const { getDates } = require('./getDates');
const twitter = require = require('./twitter');

const infoCities = [
  {
    nome: 'ARAÇATUBA',
    populacao: 198087.57,
    enabled: false,
  },
  {
    nome: 'BIRIGUI',
    populacao: 124851.24,
    enabled: false
  },
  {
    nome: 'GUARARAPES',
    populacao: 33109.49,
    enabled: true,
  },
  {
    nome: 'VALPARAÍSO',
    populacao: 26816.10,
    enabled: false,
  }
]

async function _getPercentage({city, doses}){
  const infoCity = infoCities.filter((item) => item.nome === city && item.enabled === true)
  console.log({doses})
  console.log({infocity: infoCity[0].populacao})
  return (Number(doses)*100) / Number(infoCity[0].populacao);
}


async function _getBodyContent({result, infoDate}){
  const percentagedose1 = await _getPercentage({city: result[0]['Município'], doses: result[0]['Total Doses Aplicadas']});
  const percentagedose2 = await _getPercentage({city: result[1]['Município'], doses: result[1]['Total Doses Aplicadas']});
  return `  Vacina COVID-19 - ${result[0]['Município']} - Dia: ${infoDate}\n\n
  ${result[0].Dose} \n
  Total Doses Aplicadas: ${result[0]['Total Doses Aplicadas']} - Aprox: ${percentagedose1.toFixed(2)}% população \n\n 
  ${result[1].Dose} \n
  Total Doses Aplicadas: ${result[1]['Total Doses Aplicadas']} - Aprox: ${percentagedose2.toFixed(2)}% população \n\n 
        
  \n\n\n fonte: vacinaja são paulo` 
}


async function ReadFile(){
  console.log('Read file')
  const {archiveDate, year, month, fulldate, infoDate} = await getDates();
  console.log('This now dates:',archiveDate, fulldate);

  try {
    const jsonObj = await csv().fromFile('file.csv')
    console.log({jsonObj});
    const infoCity = infoCities.filter((item) =>  item.enabled === true)
    const result =  jsonObj.filter(item => item['Município'] === infoCity[0].nome).reverse()
    console.log(result.length)
    
    if(result.length === 0){
      console.log('arquivo não está disponivel')
    }else{
      console.log('post');
      console.log(await _getBodyContent({result, infoDate}))
      // twitter.BotInit(await _getBodyContent({result, infoDate}))
    }
  } catch (err) {
    console.log('Não possui informação por enquanto', err)
  }


  
  // .then(async (jsonObj)=>{
  //     const infoCity = infoCities.filter((item) =>  item.enabled === true)
  //     const result =  jsonObj.filter(item => item['Município'] === infoCity[0].nome).reverse()
  //     console.log(result.length)
      
  //     if(result.length === 0){
  //       console.log('arquivo não está disponivel')
  //     }else{
  //       console.log('post');
  //       console.log(await _getBodyContent({result, infoDate}))
  //       twitter.BotInit(await _getBodyContent({result, infoDate}))
  //     }

  // }).catch(err => {
  //   console.log('Não possui informação por enquanto', err)
  // })

}

module.exports = {
  ReadFile
}