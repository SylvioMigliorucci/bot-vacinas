const { ReadFile } = require('./readfile');
const { CreateFile } = require('./createfile');
const { CommaFile } = require('./commafile');

(async () => {  
    await CreateFile();
    await CommaFile();
    await ReadFile();  
})();