var https = require('https');
var cheerio = require('cheerio');
var render = require('../../shared/helpers/render');

function scrapeSite(url, res){
    //break up url
    var comIndex = url.indexOf('.com');
    var path = url.substr(comIndex+4);
    
    var host = url.split('/').filter( val => { return val.includes('.com') })[0];
    var opt = {
        host: host,
        path: path,
        header: {
            'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
        }
    }

    if( host === 'www.bonappetit.com'){
        getBonAppetit(opt, res);
    }
    else if ( host === 'www.delish.com'){
        getDelish(opt, res);
    }
    else if ( host === 'paleoleap.com'){
        getPaleoLeap(opt, res);
    }
    else{
        generalRecipeScraper(opt, res);
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

function handlePaleoMultiIngredSec(bod){
    var ingreds = bod("li[itemprop='ingredients']"); //specific for paleo
    
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
} //end of handlePaeloMultiIngredSec

function handleSingleIngredSec (ingredArray) {
    //simply returns an array of object with generic header
    return [{
        header: 'Ingredients',
        ingredients: ingredArray
    }]
}

function getPaleoLeap(opt, serverRes){
    var data = {};
    data['url'] = opt.host+opt.path;
    https.get(opt, function(res){
        var str = [];
        res.on('data', function ( chunk){
            str.push(chunk.toString());
        });

        res.on('end', function (){
            str = str.join(' ');
            var bod = cheerio.load(str);
            data['ingredients'] = handlePaleoMultiIngredSec(bod);
           
            data['name'] =  bod(bod("h2[itemprop='name']").get(0)).text();
            
            var possibleReady = [bod(bod("strong[itemprop='cookTime']")).text(), bod(bod('span:contains("COOK:")')).text()].filter( r => r !== '');
            data['readyTime'] = (possibleReady.length > 0) ? possibleReady[0] : ''; 
        
            var possibleServings = [bod(bod('span.meta-servings')).text(), bod(bod('span:contains("Serves")')).text(), bod(bod('span:contains("SERVES")')).text(),].filter( r => r !== '');
            data['servings'] = (possibleServings.length > 0) ? possibleServings[0] : '';
            
            //parsing through steps
            // data['steps'] = []
            var list = bod("ol[itemprop='recipeInstructions']").get(0);
            data['steps'] = list.children.map(el => bod(el).text().trim()).filter( t => t!== '')

            generateScrapedRecipe(data, serverRes);
        })
    })
}

function getDelish(opt, serverRes){

    var vals = {
        name: 'h1.recipe-hed',
        servings: 'span.yields-amount'
    };

    var data = {};
    data['url'] = opt.host+opt.path;
    https.get(opt, function(res){
        var str = [];
        res.on('data', function ( chunk){
            str.push(chunk.toString());
        });
    
        res.on('end', function (){
            str = str.join(' ');
            var bod = cheerio.load(str);

            Object.keys(vals).forEach( ident => {
                bod(vals[ident]).each(function(i, elem){
                    var text = bod(this).text();
                    if(text !== ''){
                        var edited = text.split('\n').map(t => t.trim()).filter( t => t !== '').join(' ');
                        data[ident] = edited;
                    }
                })
            });
    
            data['ingredients'] = [];
            bod("div.ingredient-item").each( (i,elems) => {
                var ingredient = [];
                elems.children.forEach((elm) => {
                    if( elm.attribs && elm.attribs.class === 'ingredient-amount'){
                        //amounts are seperate
                        var amount = elm.children[0].data.trim();
                        var edited = amount.split(' ').map(t => t.trim()).join(' ');
                        ingredient.push(edited);
                    }
                    else if( elm.attribs && elm.attribs.class === 'ingredient-description'){
                        //ingredient description
                        var description = elm.children[0]; //description could include a <p>
                        if ( description.children ){
                            ingredient.push(description.children[0].data.trim())
                        }
                        else {
                            ingredient.push(description.data.trim()) 
                        }
                    }
                })
                data['ingredients'].push(ingredient.join(' '));
            })
            
            data['ingredients'] = handleSingleIngredSec(data['ingredients']);

            //here we get the ingredients
            data['steps'] = [];
            bod("div.direction-lists").each( (i, elems) => {
                elems.children[0].next.children.forEach( ingre => {
                    data['steps'].push(ingre.children[0].data.trim());
                })
            })
            
            bod("span.total-time-amount").each( ( i, elems) => {
                var time = [];
                elems.children.forEach( tag => {
                    if(tag.type === 'text'){
                        time.push(tag.data.trim());
                    }
                    time = time.filter(t => t !== '');
                })
                var timeText = time.join(' hr ');
                timeText+=' min';
                data['readyTime'] = timeText;
            })

            //now we use the callback
            generateScrapedRecipe(data, serverRes);
        });

    });
}

function getBonAppetit(opt, serverRes){
    var data = {};
    data['url'] = opt.host+opt.path;
    https.get(opt, function(res){
        var str = [];
        res.on('data', function ( chunk){
            str.push(chunk.toString());
        });
    
        res.on('end', function (){
            str = str.join(' ');
            var bod = cheerio.load(str);

            data['name'] = bod('.top-anchor')[0].children[0].data;
    
            var ingredients = [];
            bod('div[class="ingredients__text"]').each(function(i, elem){
                ingredients.push(bod(this).text());
            });

            data['ingredients'] = handleSingleIngredSec(ingredients);
            //here we get the ingredients
            data['servings'] = bod('.recipe__header__servings span')[0].children[0].data;
            
            var steps = [];

            bod('li[class="step"] div p').each(function(i, elem){
                var elm = bod(this);

                var arr = elem.children;
                var step = ''
                arr.forEach(child => {
                    if( child.type === 'text'){
                        step+= child.data
                    }
                    else if ( child.name === 'strong'){
                        step+= child.children[0].data;
                    }
                });
                steps.push( step );
            })

            data['steps'] = steps;

            //now we use the callback
            generateScrapedRecipe(data, serverRes);

        });

    });
    
};

function generateScrapedRecipe( data, res){
    //we will use the data here to make a new website
    //convert ingredients to li elements
    var ingredients = '';
    // console.log(data['ingredients']);
    data['ingredients'].forEach( function (ingredObj){
        if ( ingredObj.header !== 'Ingredients'){
            ingredients += '<h4 class="long-form-subheader">'+ingredObj.header+'</h4>'
        }

        //now organize the array
        ingredObj.ingredients.forEach( function ( ingred, i  ){
            ingredients += '<li><textarea rows="2" name="ingredient_'+ ingredObj.header +'_'+ (i) +'" required>'+ingred+'</textarea></li>'
        })

    });

    var steps = '';
    data['steps'].forEach((step, i) => {
        //need to break the step into sentences
        // var smallSteps = step.split(/. (?=[A-Z])/);
        // smallSteps.forEach( sstep => {
        //     steps += '<li>'+sstep+'</li>';
        // })
        steps += '<li><label class="long-form-header">'+(i+1)+'.</label><textarea rows="8" name="step_'+ i +'" required>'+step+'</textarea></li>';
    })

    var values = {
        specificScript : '',
        centerLabel: '',
        navbarList: '',
        ingredients: ingredients,
        steps: steps,
        name: data['name'],
        url: data['url'],
        servings: data['servings']
    }
    var sections = {
        navbar: 'shared/modules/auth-navbar.html',
        main: 'recipes/views/scrapedRecipe.html'
    }

    render.constructPage(
        'shared/templates/generic.html', 
        sections,
        values,
        res
    );
    res.end();

};

function generalRecipeScraper(opt, serverRes){
    var vals;
    switch(opt.host) {
        case 'www.allrecipes.com':
            vals = allRecipesSelectors;
            break;
        case 'www.foodnetwork.com':
            vals = foodNetworkSelector;
            break;
        default: 
            break;//resolve issue
    }

    var data = {};
    data['url'] = opt.host+opt.path;
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
            Object.keys(vals).forEach( ident => {
                var arr = []
                // console.log(vals[ident]);
                bod(vals[ident]).each(function(i, elem){
                    var text = bod(this).text();
                    if(text !== '')
                        arr.push(text.trim());
                })
                data[ident] = arr;
            });

            data['ingredients'] = handleSingleIngredSec(data['ingredients']);
            // console.log(data);
            generateScrapedRecipe(data, serverRes);      
        });
    }); 
}

const allRecipesSelectors = {
    readyTime: '.ready-in-time',
    name: '.recipe-summary__h1',
    steps: 'span[class="recipe-directions__list--item"]',
    ingredients: 'span[class="recipe-ingred_txt added"]',
    servings: 'div[class="subtext"]',
};

const foodNetworkSelector = {
    readyTime: '.m-RecipeInfo__a-Description--Total',
    name: '.o-AssetTitle__a-HeadlineText',
    steps: 'li[class="o-Method__m-Step"]',
    ingredients: 'p[class="o-Ingredients__a-Ingredient"]',
    servings: 'span.o-RecipeInfo__a-Description:contains("serving")',
}

module.exports = {
    scrapeSite: scrapeSite,
}