var https = require('https');
var cheerio = require('cheerio');


var opt = {
    host: 'paleoleap.com', //www - .comhttps://paleoleap.com/egg-and-smoked-salmon-open-faced-apple-sandwich/
    path: '/mushroom-and-apple-stuffed-rolled-pork/', //rest of address
    header: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    }
}

function searchForHeaderNode(el){
    if (!el.name || el.name && el.name !== 'h3'){
        return searchForHeaderNode(el.prev)
    }
    else {
        return el;
    }
}

function handleIngredients(bod){
    var ingreds = bod("li[itemprop='ingredients']");
    
    var ingredObj = {};
    var currentParent = '';
    var currentHeader = '';
    ingreds.each( function (i ,el){
        //for the first item we add the header
        if ( currentParent !== el.parent){
            //get the header of the first item 
            //will do recursive prev search until h3 tag appears
            currentParent = el.parent;
            var ingredientText = bod(el).text();
            var h3El = searchForHeaderNode(el.parent);
            currentHeader = h3El.children[0].data;
            ingredObj[currentHeader] = {
                header: currentHeader,
                ingredients: [ingredientText]
            }
        }
        else {
            //add to the last ingredients array
            ingredObj[currentHeader].ingredients.push(bod(el).text());
        }

    })

    var ingredients = Object.keys(ingredObj).map(function(headerKey){
        return ingredObj[headerKey]
    })
    return ingredients;
}

https.get(opt, function(res){
    var str = [];
    res.on('data', function ( chunk){
    
        str.push(chunk.toString());
        
        
    });

    res.on('end', function (){
        str = str.join(' ');
        var bod = cheerio.load(str);

        var data = {};

        data['ingredients'] = handleIngredients(bod);
        
        data['name'] =  bod(bod("h2[itemprop='name']").get(0)).text();
        
        var possibleReady = [bod(bod("strong[itemprop='cookTime']")).text(), bod(bod('span:contains("COOK:")')).text()].filter( r => r !== '');
        data['readyTime'] = (possibleReady.length > 0) ? possibleReady[0] : ''; 
    
        var possibleServings = [bod(bod('span.meta-servings')).text(), bod(bod('span:contains("Serves")')).text(), bod(bod('span:contains("SERVES")')).text(),].filter( r => r !== '');
        data['servings'] = (possibleServings.length > 0) ? possibleServings[0] : '';
        
        //parsing through steps
        // data['steps'] = []
        var list = bod("ol[itemprop='recipeInstructions']").get(0);
        data['steps'] = list.children.map(el => bod(el).text().trim()).filter( t => t!== '')

        console.log(data);       
    })
});

            