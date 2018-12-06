var https = require('https');
var cheerio = require('cheerio');
var scanIngredients = require('../shared/helpers/ingredParser');

var host = "www.allrecipes.com"
var path = "/recipe/246654/grilled-salmon-radicchio-wraps";
var opt = {
    host: host,
    path: path,
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
        str = str.join(' ');
        var bod = cheerio.load(str);
        //now we look for the ingredients
        var identifier = 'span[class="recipe-ingred_txt added"]';
        var arr = [];
        bod(identifier).each(function(i, elem){
        
            var text = bod(this).text();
            console.log(text);
            if(text !== '')
                arr.push(text.trim());
        })
        console.log(arr);
        scanIngredients(arr);
    });
});