var render = require('../../shared/helpers/render');
var Recipe = require('../../models/recipe');
var User = require('../../models/user');
var mongoose = require('mongoose');
var Calendar = require('../../models/calendar');
var utils = require('../../shared/helpers/utils');

function postNewRecipe (req, res){

    //gather ingredients
    var ingredients = {};
    var steps = [];
    for ( var key in req.body){
        if ( key.includes('ingredient_') ){
            //must be broken into key objs
            var header = key.split('_')[1];
            if( ingredients[header]){
                ingredients[header].push(req.body[key])
            }
            else { 
                ingredients[header] = [req.body[key]]
            }
        }
        if ( key.includes('step_')){
            steps.push(req.body[key])
        }
    }
    // console.log(ingredients);
    // console.log(steps);
    var servings = standardizeServings(req.body.servings);
    ingredients = convertIngredients(ingredients);


    var newRecipe = new Recipe({
        _id: new mongoose.Types.ObjectId,
        url: req.body.url,
        name: req.body.name,
        ingredients: ingredients,
        steps: steps,
        servings: servings
    }, function( err, recipe ) {
        if( err ){
            res.writeHead(500);
            res.end('Issue with the recipe creation');
        }
        // console.log('New Recipe: '+recipe);
    });
    //saving calendar
    // console.log('Recipe: '+ newRecipe);
    newRecipe.save(function (err){
        if ( err ){
            console.log(err);
            if( err.code === 11000){
                //means we have a duplicate recipe
                //add existing recipe to user's cook book
                Recipe.findOne({url: newRecipe.url}, function( err, recipe){
                    console.log(recipe);
                    if( err ){
                        res.writeHead(500);
                        res.end(err);
                    }
                    User.findOneAndUpdate({'email': req.headers['cookie'].email}, {
                        $push: {'cookbook' : recipe._id}
                    }, function(err, doc){
                        if(err){
                            res.writeHead(500);
                            res.end('Issue adding recipe to current user');
                        }
                        res.writeHead(302, {'Location': '/recipes/all'})
                        res.end();
                    });
                })
            }
            else{
                res.writeHead(500);
                res.end('Unknown Error');
            }
            
        }
        else{
            User.findOneAndUpdate({'email': req.headers['cookie'].email}, {
                $push: {'cookbook' : newRecipe._id}
            }, function(err, doc){
                if(err){
                    res.writeHead(500);
                    res.end('Issue adding recipe to current user');
                }
                res.writeHead(302, {'Location': '/recipes/all'})
                res.end();
            });
        }
    });
}

function convertIngredients( ingredObj ){
    //break each ingredient string into an object with keys
    return Object.keys(ingredObj).map(function ( headerKey ){
        return { 
            header: headerKey,
            ingredients: ingredObj[headerKey]
        }
    })
}

function fetchRecipes(req, res){
    //need to find all recipes
    //will need to start searching
    
    var pageSize = 10;
    var skip = req.body.page * pageSize;
    if ( req.body.search === ''){
        //means we return all recipes
        Recipe.find({}, 'name ingredients steps servings', {limit: pageSize, skip: skip}, function(err, recipes){
            if( err ){
                console.log(err);
                res.writeHead(500);
                res.end();
            }
            // console.log('Empty Search');
            // console.log(recipes);
            res.writeHead(200);
            console.log(recipes)
            res.end(JSON.stringify(recipes));
        });
    }
    else {
        Recipe.find({$text: {"$search":req.body.search,
            "$caseSensitive": false, 
            "$diacriticSensitive": false }    
            })
        .limit(pageSize)
        .skip(skip)
        .exec(function(err, recipes){
            if( err )
            {
                console.log(err)
            }
            res.writeHead(200);
            res.end(JSON.stringify(recipes));
        })
    }
}

function addRecipeToCalendar(req , res){
    //parse the url in order to get the recipe ID
    // console.log(req.body);
    // console.log(req.url);

    // console.log(req.body.calendarID);
    // console.log(req.body.meal)
    // console.log(req.body.date);
    //we need to add to the calendar a specific recipe
    var urlArray = req.url.split('/');
    var recipeID = urlArray[2]; //url: /addToCalendar/recipeID
    var date = utils.standardizeDate(req.body.date);
    // console.log(calendarID);
    Calendar.findOne({
        _id: mongoose.Types.ObjectId(req.body.calendarID)
    }, function(err, result){

        if( err ){
            console.log('FIND ERROR:');
            console.log(err)
        }

        // console.log(result.days);
        var newDays = updateMeal(result.days.slice(), date, recipeID, req.body.meal);
         result.days = newDays;
         result.save(function(err){
             if(err) console.log(err);
         });
        //  console.log('Here are the updated days: '+ result.days);

        res.writeHead(302, {'Location': '/calendar/'+req.body.calendarID});
        res.end();
    })
        
};


function updateMeal ( arrayOfDays, date, newRecipeID, meal){

    var matchingDate = arrayOfDays.map( day => day.date.getTime()).indexOf(date.getTime());
    if ( matchingDate === -1){
        //push to the days array
        var emptyMeals = {
            breakfast: [],
            lunch: [],
            dinner: [],
            snacks: []
        };
        emptyMeals[meal].push(newRecipeID);
        arrayOfDays.push({date: date, meals: emptyMeals})
    }
    else{
        var updatedMeals = arrayOfDays[matchingDate].meals;
        updatedMeals[meal].push(newRecipeID)
        arrayOfDays[matchingDate] = {date: date, meals: updatedMeals};
    }
    return arrayOfDays;
}

function standardizeServings ( servingsText ){
    if(typeof servingsText !== 'string' )
        return 'N/A'

    if(servingsText.includes('-')){
        return servingsText.match(/[0-9]+-[0-9]+/) + ' servings'
    }
    else if ( servingsText.includes(' to ')){
        var matchingNums = servingsText.match(/[0-9]+\s*to\s*[0-9]+/)[0].replace(' to ', '-');
        return  matchingNums +' servings'
    }
    else if( servingsText.includes(' 1 ')){
        return '1 serving'
    }
    else if(servingsText.search(/[0-9]+/)>= 0 ) {
        return servingsText.match(/[0-9]+/) + ' servings'
    }
    else {
        return 'N/A'
    }
}

module.exports = {
    postNewRecipe: postNewRecipe,
    fetchRecipes: fetchRecipes,
    standardizeServings: standardizeServings,
    addRecipeToCalendar: addRecipeToCalendar
}