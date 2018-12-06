// var parser = require('../../../../recipe-parser/src/index');
// var parse = parser.parse;
// var prettyPrintingPress = parser.prettyPrintingPress;
// var combine = parser.combine;
// var ingredParser = require('');
var parserIndex = require('../../../recipe-parser/src/index');
var ingredParser = require('../../shared/helpers/ingredParser');

var testing = [
    "2 garlic cloves, finely grated",
    "2 Tbsp. plus 2 tsp. fresh lemon juice",
    "2 tsp. freshly ground black pepper, plus more",
    "⅓ cup plus 2 tsp. extra-virgin olive oil, plus more for grill",
    "¼ cup chopped cornichons (about 9)",
    "4 large or 6 small skinless, boneless chicken thighs",
    "1 small head Little Gem lettuce",
    '1 medium tomato, sliced ¼" thick',
    "something that doesnt exist",
    "making this a very long ingredient, for no good reason what so ever, maybe i hsouldjustjsdjf;klajsdfklj a;dsjf jfldasjfsdl lasdfjasdf"
];
// var testing = [
//     "⅓ cup plus 2 tsp. extra-virgin olive oil, plus more for grill",
//     '1 medium tomato, sliced ¼" thick'
// ]
// testing = [
//     '¼ cup vegetable oil',
//     '1 cup vegetable oil',
//     '1 tablespoon vegetable oil',
// ]

var actions = [
    "plus",
    "or"
]

function countNums (str) {
    const numericAndFractionRegex = /^(\d+\/\d+)|(\d+\s\d+\/\d+)|(\d+\-\d+)|(\d+.\d+)|\d+/g;
    const unicodeFractionRegex = /\d*[^\u0000-\u007F]+/g;
    var f = ((str || '').match(numericAndFractionRegex) || []).length
    var s = ((str || '').match(unicodeFractionRegex) || []).length
    return f+s;
}

const numericAndFractionRegex = /^(\d+\/\d+)|(\d+\s\d+\/\d+)|(\d+\-\d+)|(\d+.\d+)|\d+/g;
const unicodeFractionRegex = /\d*[^\u0000-\u007F]+/g;
const onlyUnicodeFraction = /[^\u0000-\u007F]+/g;

/*Might expand, but for now it only takes the paranthesis away*/
function cleanUpString ( string ){
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

function splitMultipleUnits( ingLine ){
    //will countNums the number of matches
    var ingredLines = [];
    // console.log(ingLine + ": "+countNums(ingLine) )
    if( countNums(ingLine) > 1){
        var iArray = ingLine.split(' ');
        var possUnits = [];
        var lastIndex = -1;
        var possibleMidWord = '';
        iArray.forEach( function ( s, i ){
            var a = s.match(numericAndFractionRegex);
            // var b = s.match(onlyUnicodeFraction);
            var c = s.match(unicodeFractionRegex);
            if ( a || c ){
                //unit and value
                //check if we have already found a previous unit 
                const [unit, shorthand] = parserIndex.getUnit(iArray[i+1]);
                if( unit ){
                    //means we have a unit sequence
                    lastIndex = i+1;
                    possUnits.push(iArray[i]+' '+iArray[i+1]);
                }
                else {
                    //must remove it since it doesnt pertain
                    ingLine = ingLine.replace(s, '').trim();
                }
                if ( i+2 < iArray.length  && actions.some((s) => {
                    return s === iArray[i+2]
                })){
                    possibleMidWord = iArray[i+2];
                }
            }
        })
    
        //now we create two ingredients from the units or we toss one
        
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

    

    console.log(ingredLines);
}
splitMultipleUnits(testing[7])
// testParse(testing[5]);


// var t = ingredParser.scanIngredients(testing);
// debugger;
// var out = testing.map( (text ) =>{
//     // text = text.split(' or ')[0];
//     text = text.split(',')[0];
//     // text = text.split(' (')[0];
//     var p = parserIndex.parse(text);
//     // console.log(p);
//     return p;
//     // console.log(prettyPrintingPress(parse(text)) );
// });
// console.log(out)
// var combined = parserIndex.combine(out);
// console.log(combined);