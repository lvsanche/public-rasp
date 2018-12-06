var handleMealsPost = require('./mealsPost');
var addNewMeal = require('./addNewMeal');

function mealsRouter(req, res, next){
    if (req.method === 'POST'){
        handleMealsPost(req, res);
    }
    else if ( req.method === 'GET' && req.url.includes('/new/') ){
        addNewMeal(req, res);
    }
    else {
        next();
    }
}

module.exports = mealsRouter;