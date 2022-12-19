//requiring path and fs modules
const path = require('path');
const fs = require('fs');
//joining path of directory
const initDirectoryPath = path.join(__dirname, '../public/content');


function getFs(directoryPath) {
    var layout = {}
    //passsing initDirectoryPath and callback function
    var files = fs.readdirSync(directoryPath)
    //listing all files using forEach
    files.forEach(function (file) {
        // Do whatever you want to do with the file
        if(fs.lstatSync(directoryPath + '/' + file).isFile()){
            var err, data = fs.readFileSync(directoryPath + '/' + file, 'utf-8')
            console
            layout[file] = data
        } else {
            var subFs = getFs(directoryPath + '/' + file)
            layout[file] = subFs
        }
    });
    return layout
}

var fsLayout = getFs(initDirectoryPath)
fs.writeFile('src/data/FS_GENERATED.json', JSON.stringify(fsLayout), (error) => {
    if (error) throw error;
});