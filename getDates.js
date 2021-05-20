

async function getDates(){
  const fulldate = new Date();
  const day = String(fulldate.getDate()).padStart(2,'0')
  const month = String(fulldate.getMonth() + 1).padStart(2,'0')
  const year = fulldate.getFullYear()
  const archiveDate = `${year}${month}${day}`
  const infoDate = `${day}/${month}/${year}`
  return {
    archiveDate,
    day,
    month,
    year,
    fulldate,
    infoDate
  }
}

module.exports = {
  getDates
}
