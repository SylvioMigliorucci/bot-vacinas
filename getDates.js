

async function getDates(){
  const fulldate = new Date();
  const day = 27//fulldate.getDate();
  const month = ("0" + (fulldate.getMonth() + 1)).slice(-2);
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
