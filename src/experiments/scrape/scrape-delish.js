var https = require('https');
var cheerio = require('cheerio');
var allRenders = require('../../../recipe-parser/src/index');

var vals = {
    name: 'h1.recipe-hed',
    servings: 'span.yields-amount'
};

var opt = {
    host: 'www.delish.com', //www - .comhttps://www.delish.com
    path: '/cooking/recipe-ideas/a22790813/lobster-mac-recipe/', //rest of address
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
            bod(vals[ident]).each(function(i, elem){
                var text = bod(this).text();
                if(text !== ''){
                    var edited = text.split('\n').map(t => t.trim()).filter( t => t !== '').join(' ');
                    allData[ident] = edited;
                }
            })
        });

        allData['ingredient'] = [];
        bod("div.ingredient-item").each( (i,elems) => {

            var ingredient = [];
            elems.children.forEach((elm) => {
                if( elm.attribs && elm.attribs.class === 'ingredient-amount'){
                    var amount = elm.children[0].data.trim();
                    var edited = amount.split('\n').map(t => t.trim()).filter( t => t !== '').join(' ');
                    // console.log(edited)
                    ingredient.push(edited);
                }
                else if( elm.attribs && elm.attribs.class === 'ingredient-description'){
                    var description = elm.children[0]; //description could include a <p>
                    if ( description.children ){
                        ingredient.push(description.children[0].data.trim())
                    }
                    else {
                        ingredient.push(description.data.trim()) 
                    }
                }
            })
            
            allData['ingredient'].push(ingredient.join(' '));
        })
        console.log(allData['ingredient'].map(t => allRenders.parse(t)))

        allData['steps'] = [];
        bod("div.direction-lists").each( (i, elems) => {
            elems.children[0].next.children.forEach( ingre => {
                allData['steps'].push(ingre.children[0].data.trim());
            })
        })

        bod("span.total-time-amount").each( ( i, elems) => {
            var time = [];
            elems.children.forEach( tag => {
                if(tag.type === 'text'){
                    // console.log(tag.data.trim());
                    time.push(tag.data.trim());
                }
                time = time.filter(t => t !== '');
                // console.log(time)
            })
            var timeText = time.join(' hr ');
            timeText+=' min';
            allData['readyTime'] = timeText;
        })
        // console.log(allData);       
    })
});
