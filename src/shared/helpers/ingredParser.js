var fs = require('fs');
var path = require("path");

var ingredFile = '../configs/ingredients.json'
var parseIndex = require('../../../recipe-parser/src/index');


function findIngredMatch ( ingredientLine ){ //much slower
    var rawdata = fs.readFileSync(path.resolve(__dirname, ingredFile));
    var ingredients = JSON.parse(rawdata)['ingredients'];

    var parsed = parseIndex.parse(ingredientLine);
    var bestMatch = '';

    Object.keys(ingredients).forEach( function (ingredKey){

        if ( parsed.ingredient.indexOf(ingredKey) > -1){
            //means we have a match, lets look at the more closer ingredients
            ingredients[ingredKey].forEach(function (specificName){
                if(specificName.length > bestMatch.length && parsed.ingredient.indexOf(specificName) > -1){
                    bestMatch = specificName;
                }
            })
        }
    });
    
    //now we have the best match
    if ( bestMatch.length > 0 ){
        //means a match was found
        parsed.ingredient = bestMatch;
    }
    else {
        fs.appendFileSync('missingIngredients.txt', ingredientLine+ '\n'); 
    }
    return parsed;
}

function oldMatch (ingredientLine, toReturnAllIngreds){
    if( typeof ingredientLine === 'string'){
        var ingredLineLower = ingredientLine.toLowerCase(); 
        ingredLineLower = ingredLineLower.split(',')[0];
        // ingredLineLower = ingredLineLower.split(' or ')[0];
        var parsed = parseIndex.parse(ingredLineLower);
        
        if( Object.keys(ingredients).every( function( ingredName ){ //every return false to end the loop
            //trying to match with regex to not oversimplify items
            if(ingredLineLower.indexOf(ingredName) >=0){
                //means we have a match, lets look at the more detailed ingredients
                if(ingredients[ingredName].every(function(specificName){
                    // console.log(specificName);
            
                    if( ingredLineLower.indexOf(specificName) >=0){
                        parsed['ingredient'] = specificName;
                        allIngreds[ingredLineLower] = parsed;
                        toReturnAllIngreds.push(parsed);
                        return false;
                    }
                    else{
                        return true;
                    }
                }))
                {
                    //now we have found a partial as specific was not found
                    fs.appendFileSync('missingIngredients.txt', ingredientLine+ ' : '+ingredName + '\n' ); 
                }
                return false; //this ends the loop
            }
            else{
                return true; //continue as the ingredient was not found
            }
        })){
            //means we did not find the ingredient
            console.log('Missing ingredient: ' + ingredientLine);
            fs.appendFileSync('missingIngredients.txt', ingredientLine+ '\n'); 
        };
    }
    return parsed;
};

//now we go through the function
function scanIngredients( stringArray ){
    var toReturnAllIngreds = [];
    stringArray.forEach( function (ingredientLine){
        //first clean and see if lines are multiples
        if( typeof ingredientLine === 'string'){
            var ingredLine_s = splitMultipleUnits(ingredientLine)
            ingredLine_s.forEach( function ( ingredLine){
                var parsedIng = findIngredMatch(ingredLine);
                toReturnAllIngreds.push(parsedIng);
            })
        }   
    })
    return toReturnAllIngreds;
};

//input is an array of recipe objects that have been pulled from 
function scanRecipes ( recipesArray ) {
    var completeIngredients = {};
    var allIngredients = [];

    recipesArray.forEach( function (recipe){
        //need to break the recipe down
        if( recipe['ingredients']){
            var scannedIngreds = [];
            //must make a complete list from multiple sets
            recipe.ingredients.forEach( function (ingredObj) {
                //now we work on each string list
                if( ingredObj['ingredients'] && 
                    ingredObj['ingredients'].every(function (ing){ return typeof ing === 'string'} )){
                        var scanned = scanIngredients(ingredObj.ingredients);
                        scannedIngreds.push.apply(scannedIngreds, scanned); //append to growing scanned ingreds list
                }
            })
            // console.log(scannedIngreds)
            scannedIngreds.forEach( function (ingred){
                if(!completeIngredients[ingred['ingredient']]){
                    completeIngredients[ingred['ingredient']] = {
                        'recipes': []
                    };
                }
                completeIngredients[ingred['ingredient']]['recipes'].push( {
                    'name': recipe['name'],
                    'url': '/recipes/'+recipe['_id'],
                    'unit': ingred['unit'],
                    'quantity': ingred['quantity']
                }) 
            });
    
            allIngredients.push.apply(allIngredients, scannedIngreds);
        }
    });
    
    if ( allIngredients.length > 0){
        var combined = parseIndex.combine(allIngredients);
        //now we add the combined total to the complete Recipes object
        combined.forEach( function( ingredient) {
            completeIngredients[ingredient['ingredient']]['total'] = {
                'unit': ingredient['unit'],
                'quantity': ingredient['quantity']
            };
        })
    }

    return alphaObject(completeIngredients);
}

function alphaObject (object) {
    //will organize keys alpha
    var ordered = {};
    Object.keys(object).sort().forEach(function (key){
        ordered[key] = object[key];
    });

    return ordered;
}

/**HAVE MANY HELPER FUNCTIONS FOR THE PARSING OF Ingredient lines */
const numericAndFractionRegex = /^(\d+\/\d+)|(\d+\s\d+\/\d+)|(\d+\-\d+)|(\d+.\d+)|\d+/g;
const unicodeFractionRegex = /\d*[^\u0000-\u007F]+/g;
function countNums (str) {
    var f = ((str || '').match(numericAndFractionRegex) || []).length
    var s = ((str || '').match(unicodeFractionRegex) || []).length
    return f+s;
}

function cleanUpString ( string ){
    string = string.toLowerCase();
    var fInd = string.indexOf('(');
    if( fInd > -1){
        var lInd = string.indexOf(')')+1;
        var toRem = string.slice(fInd, lInd);
    
        var toRet = string.replace(toRem,'').trim(); 
        return toRet;
    }
    else {
        return string
    }
}

const actions = [
    "plus",
    "or"
]

function splitMultipleUnits( ingLine ){
    //will countNums the number of matches
    var ingredLines = [];
    ingLine = cleanUpString(ingLine);
    if( countNums(ingLine) > 1){
        var iArray = ingLine.split(' ');
        var possUnits = [];
        var lastIndex = -1;
        var possibleMidWord = '';
        iArray.forEach( function ( stringSnip, i ){
            var a = stringSnip.match(numericAndFractionRegex);
            // var b = s.match(onlyUnicodeFraction);
            var c = stringSnip.match(unicodeFractionRegex);
            if ( a || c ){
                //unit and value
                //check if we have already found a previous unit 
                const [unit, shorthand] = parseIndex.getUnit(iArray[i+1]);
                if( unit ){
                    //means we have a unit sequence
                    lastIndex = i+1;
                    possUnits.push(iArray[i]+' '+iArray[i+1]);
                }
                else {
                    //must remove it since it doesnt pertain
                    ingLine = ingLine.replace(stringSnip, '').trim();
                }

                //now we much check what the "action" word is
                if ( i+2 < iArray.length  && actions.some((s) => {
                    return s === iArray[i+2]
                })){
                    possibleMidWord = iArray[i+2];
                }
            }
        })

        switch( possibleMidWord ){
            case 'plus':
                //means we create two strings and return them
                if( possUnits.length === 2 ){
                    var restIngred = iArray.splice(lastIndex+1).join(' ');
                    ingredLines = possUnits.map( function (unit){
                        //now add the end of the ingred line to unit
                        return unit + ' '+restIngred;
                    })
                }
                
                break;
            case 'or':
                //means we only create 1 new string and remove the second unit
                ingredLines.push(possUnits[0]+ ' '+ iArray.splice(lastIndex+1).join(' '))
                break;
            default: 
                //just return 1 string
                //no match means just return the string back
                ingredLines.push(ingLine)
    
        }
    }
    else {
        ingredLines.push(ingLine)
    }
    return ingredLines;
}

module.exports = {
    scanIngredients: scanIngredients,
    scanRecipes: scanRecipes
};