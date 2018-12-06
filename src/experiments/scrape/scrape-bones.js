var https = require('https');
var cheerio = require('cheerio');

var vals = {
    readyTime: '',
    name: '',
    steps: '',
    ingredients: '',
    servings: '',
};

var opt = {
    host: '', //www - .com
    path: '', //rest of address
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
    })
});
