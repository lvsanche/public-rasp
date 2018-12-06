var helpers = require('./helpers');
var scraper = require('./websiteScraper');

function addNewRecipe(req, res){
    //first get the req
    if( req.url === '/scrape'){
        scraper.scrapeSite(req.body['recipeURL'], res);
    }
    else if ( req.url === '/new'){
        // console.log(req.body);
        //redirect to recipes
        helpers.postNewRecipe(req,res);
    }
    else if ( req.url === '/fetchRecipes'){
        helpers.fetchRecipes(req,res);
    }
    else if (req.url.includes('/addToCalendar')){
        helpers.addRecipeToCalendar(req,res);
    }
    
}

module.exports = addNewRecipe;