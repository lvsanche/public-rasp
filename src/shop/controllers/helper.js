var queryWeek = require('../../calendar/controllers/calendarPost').queryWeek;
var promiseAllIds = require('../../calendar/controllers/helpers').promiseAllIds;
var ingredParser = require('../../shared/helpers/ingredParser');
var render = require('../../shared/helpers/render');

function handleAggregatingIngredients ( req, res){
    var splitUrl = req.url.split('/');

    var calendarID = splitUrl[1];
    var sundayDate = splitUrl[2];

    fetchRecipesAndScan(sundayDate, calendarID, res);
}

function constructShopHtml ( res, ingredientsHtml){
    var values = {
        specificScript : '<script src="/shop/views/shop.js"></script>',
        centerLabel: '',
        navbarList: '',
        main: ingredientsHtml
    }
    var sections = {
        navbar: 'shared/modules/auth-navbar.html',
        main: 'shop/views/shop.html'
    }

    render.constructPage(
        'shared/templates/generic.html', 
        sections,
        values,
        res
    );

    res.end();
}

function makeRecipeBreakDown(recipes, ingred){
    var html = '';

    html+= '<div id="'+ingred+'-breakdown" class="is-hidden" >'
    recipes.forEach(function(recipe){

        var quantity = recipe.quantity || '';
        var units = recipe.unit || '';

        html+='<div class="two-cols inner">';
        html+='<label>'+  recipe.name  +'</label>';
        html+='<label>'+quantity+ ' '+ units+'</label>';
        html+='</div>'
    })
    
    html+='</div>'

    return html;
}


function ingredientsConverted( ingredientsObject, res ){
    //using the object returned from scanRecipes
    //must create divs per ingredient
    // console.log(Object.keys(ingredientsObject));
    var ingredientsHtml = '';
    Object.keys(ingredientsObject).forEach(function(ingred){
        // console.log(ingred);
        ingredientsHtml+= '<div id="'+ingred+'"class="stackedContainer">';
        var quantity = ingredientsObject[ingred]['total']['quantity'] || '';
        var units = ingredientsObject[ingred]['total']['unit'] || '';
        // console.log(quantity);
        ingredientsHtml+='<div class="two-cols">';
        ingredientsHtml+='<label>' + ingred[0].toUpperCase()+ingred.substr(1, ingred.length)+' <i class="fas fa-caret-down"></i></label>';
        ingredientsHtml+='<label>'+quantity+ ' '+ units+'</label></div>';


        var recipes = ingredientsObject[ingred].recipes;
        ingredientsHtml+=makeRecipeBreakDown(recipes, ingred);


        ingredientsHtml+= '</div>';
        // console.log(ingredientsHtml);
    });

    //now we respond
    constructShopHtml(res, ingredientsHtml);
}

function fetchRecipesAndScan ( sundayDate, calendarID, res ) {
    //use fetchDates from /calendar and filter out the recipes
    queryWeek(sundayDate, calendarID).then( function(output){
        // console.log(output)
        if( output[0]){
            var returnedObj = promiseAllIds(output[0].days);
            returnedObj.promises.then(function(results){
                console.log(results); // with results we want to fetch all those recipes' ingredients
                if ( results.length > 0 ){
                    var ingredientsParsed = ingredParser.scanRecipes(results);
                    ingredientsConverted(ingredientsParsed, res);
                }
                else {
                    //no ingredients, no recipes
                    ingredientsConverted({
                        'No Items to shop for': {'total': {
                            'quantity': null, 'unit': null}, 'recipes': []}}, res);
                }
                
            })
        }
        else{
            ingredientsConverted({
                'No Items to shop for': {'total': {
                    'quantity': null, 'unit': null}, 'recipes': []}}, res);
        }
    });
};


module.exports = {
    fetchRecipesAndScan: fetchRecipesAndScan,
    ingredientsConverted: ingredientsConverted,
    handleAggregatingIngredients: handleAggregatingIngredients
};