var fs = require('fs');
var path = require('path');

function substituteValues ( values, content ){
    for (var key in values ){
        var newRegex = RegExp('{{'+key+'}}', "g")
        content = content.replace(newRegex, values[key]);
    }
    return content;
}

function constructPage (templateFile, sections, values, response) {
    // console.log(__dirname);
    var filePath = path.resolve(__dirname, '../../'+templateFile)
    // console.log(filePath);
    var fileContent = fs.readFileSync(filePath, 'utf-8');
    fileContent = substituteSections(sections, fileContent);
    fileContent = substituteValues(values, fileContent);
    response.write(fileContent);   
}

//array of the names of files that will substitute
function substituteSections (sections, content) {
    for ( var secFile in sections ) {
        var filePath = path.resolve(__dirname, '../../'+sections[secFile]);
        // console.log('sub path:' + filePath);
        var fileContent = fs.readFileSync(filePath, 'utf-8');
        content = content.replace("{{"+secFile+"}}", fileContent)
    }
    return content;
}

module.exports = {
    constructPage: constructPage
};