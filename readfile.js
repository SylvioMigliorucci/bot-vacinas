const fs = require('fs');
const csv = require("csvtojson");
const { getDates } = require('./getDates');
const twitter = require('./twitter');

const infoCities = require('./watchedCities');

const COL_TOTAL = 'Total Doses Aplicadas';
const COL_CITY = 'Município'

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.toLowerCase().slice(1);
}

async function _getPercentage({city, doses}){
  const infoCity = infoCities.filter((item) => item.nome === city)
  console.log({doses})
  console.log({infocity: infoCity[0].populacao})
  return (Number(doses) * 100) / Number(infoCity[0].populacao);
}

async function _getPreviousRate( {city, doses}, dose ){  

  const data = await new Promise((resolve, reject) => {
    fs.readFile('prevData.json', (err, data) => {
      if (err) return reject(err);  

      return resolve(data);
    });
  });
  
  const jsonData = JSON.parse(data);
  const previousData = jsonData.filter((item) => item.city === city);  
  const obj = {...previousData[0] };
 
  if (obj.doses) {    
    const rate = (1 - (Number(obj.doses[dose]) / Number(doses))) * 100;
    if (rate > 0) {
      return `(+${rate.toFixed(1)}% em relação a ${obj.date})`
    }
  }

  return '';
}

async function _setPreviousData(data) {
  const jsonData = await JSON.stringify(data);

  await fs.writeFileSync('prevData.json', jsonData);
}

async function _getBodyContent({result, infoDate}){
  const percentageDose1 = await _getPercentage({city: result[0][COL_CITY], doses: result[0][COL_TOTAL]});
  const percentageDose2 = await _getPercentage({city: result[1][COL_CITY], doses: result[1][COL_TOTAL]});
  const prevRates1 = await _getPreviousRate({city: result[0][COL_CITY], doses: result[0][COL_TOTAL]}, 0);
  const prevRates2 = await _getPreviousRate({city: result[1][COL_CITY], doses: result[1][COL_TOTAL]}, 1);    

  return `Vacinação COVID-19 - ${capitalize(result[0][COL_CITY])} - Dia: ${infoDate}\n\n
  ${result[0].Dose}
  Doses Aplicadas: ${result[0][COL_TOTAL]} - Aprox.: ${percentageDose1.toFixed(2)}% da população ${prevRates1}\n\n 
  ${result[1].Dose}
  Doses Aplicadas: ${result[1][COL_TOTAL]} - Aprox.: ${percentageDose2.toFixed(2)}% da população ${prevRates2}
        
  \n\n\n Fonte: VacinaJa São Paulo` 
}


async function ReadFile(){
  console.log('Read file')
  const {archiveDate, fulldate, infoDate} = await getDates();
  console.log('This now dates:',archiveDate, fulldate);

  let previousData = [];

  try {
    const jsonObj = await csv().fromFile('file.csv')

    for (const city of infoCities) {
      const result =  jsonObj.filter(item => item[COL_CITY] === city.nome && city.enabled).reverse()
      console.log(result.length)
      
      if(result.length === 0){
        console.log('arquivo não está disponivel')
      } else {
        
        // Armazenar dados da última consulta em um array e depois gravá-lo em um .json
        previousData.push({
          city: result[0][COL_CITY],
          doses: [
            result[0][COL_TOTAL],
            result[1][COL_TOTAL],
          ],
          date: infoDate
        });

        console.log(await _getBodyContent({result, infoDate}))
        
        twitter.BotInit(await _getBodyContent({result, infoDate}))
      }      
    }

    _setPreviousData(previousData);    
  } catch (err) {
    console.log('Não possui informação por enquanto', err)
  }

}

module.exports = {
  ReadFile
}