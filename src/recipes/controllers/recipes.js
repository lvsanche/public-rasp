var handleRecipePost = require('./recipePost');
var recipeGet = require('./recipeGet');
var handleNewRecipeGet = require('../controllers/newRecipe');

function recipesRouter (req, res, next){
    console.log(req.url);
    if (req.method === 'POST'){
        handleRecipePost(req, res, next);
    }
    else if ( req.method === 'GET' && req.url === '/scrape'){
        handleNewRecipeGet(res);
    }
    else if ( req.method === 'GET' && req.url.includes('addToCalendar')){
        recipeGet.addToCalendar(req, res)
    }
    else if  (req.method === 'GET' && req.url === '/all'){
        recipeGet.getAllRecipes(res);
    }
    else {
        //this is the get recipe with the object id
        recipeGet.getRecipe(req, res)
    }
}

module.exports = recipesRouter;