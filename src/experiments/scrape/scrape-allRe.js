var https = require('https');
var cheerio = require('cheerio');
var scanIngredients = require('../../shared/helpers/ingredParser');
var vals = {
    readyTime: '.ready-in-time',
    name: '.recipe-summary__h1',
    steps: 'span[class="recipe-directions__list--item"]',
    ingredients: 'span[class="recipe-ingred_txt added"]',
    servings: 'div[class="subtext"]',
};
//servings: '.servings-count',
// ingredients: '.recipe-ingred_txt' ,
//servings need to get first child's text
//ingredients need to exclude 'white' class

var opt = {
    host: 'www.allrecipes.com',
    path: '/recipe/77194/bolognese-stuffed-bell-peppers/',
    header: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    }
}

https.get(opt, function(res){
    var str = [];
    res.on('data', function ( chunk){
    
        str.push(chunk.toString());
        
        
    });

    res.on('end', function (){
        // console.log(str[0]);
        str = str.join(' ');
        var bod = cheerio.load(str);
        //now we go through each
        var allData = {};
        Object.keys(vals).forEach( ident => {
            var arr = []
            console.log(vals[ident]);
            bod(vals[ident]).each(function(i, elem){
                
                var text = bod(this).text();
                
                
                if(text !== '')
                    arr.push(text.trim());
            })
            allData[ident] = arr;
        });
        console.log(allData);
        scanIngredients(allData['ingredients']);       
    })
});


function scanFor(match, rawStr){
    //scan through
    var strCpy = rawStr;
    var index = strCpy.indexOf(match);
    var closeIndex = 0;
    var matchingText = []
    while(index !== -1){
        closeIndex = strCpy.indexOf('</');
        matchingText.push(strCpy.substring(index+match.length, closeIndex));
        strCpy = strCpy.substr(closeIndex);
        index = strCpy.indexOf(match); 
    }
    return matchingText;
}