var fs = require('fs');

var ingredFile = 'C:/Users/ThinkPad/practice/project-raspberry/src/shared/configs/ingredients.json'
//now we go through the function
function organize(){
    var rawdata = fs.readFileSync(ingredFile);
    var ingredients = JSON.parse(rawdata)['ingredients'];
    var keys = Object.keys(ingredients);
    keys = keys.sort();
    var ingred = {};
    keys.forEach( t => {
        ingred[t] = ingredients[t].sort(function ( str1, str2 ){
            return str2.length - str1.length; //want to go from long str to short one
        });
    });

    //print out ingredients
    
    var output = JSON.stringify({
        'ingredients': ingred
        }, null , 4)
    fs.writeFile('organizedIngreds.json', output);
}

organize();