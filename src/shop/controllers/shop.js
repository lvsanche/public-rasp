// var handleShopPost = require('./shopPost');
var helper = require('./helper');


function ShopRouter(req, res, next){
    if ( req.method === 'GET' ){
        //will simplify by simply having a button in the calendar page
        //will split the url and get the sunday date, calculate 7 days ahead
        //get the recipes and return the list
        //must get the calendarID 
        // console.log(req.url);
        helper.handleAggregatingIngredients(req, res);
    }
    else {
        next();
    }
}

module.exports = ShopRouter;