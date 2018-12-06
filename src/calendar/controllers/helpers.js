var Recipe = require('../../models/recipe');
var mongoose = require('mongoose');

function fetchRecipeNames ( meals, res ){
    //first we must get all promises
    // console.log(meals);
    var promises = Object.keys(meals).map( function (meal){
        createMealsList(meals[meal], meal);
    })
    
    res.writeHead(200);
    res.write(JSON.stringify(meals));
    res.end();

    //we must get all the promises, for each of the sections
}

function turnNamesToListHTML ( recipeNames, section ) {
    var html = '<ul id="'+section+'-list" class="mealsBlock">';

    recipeNames.forEach( function (recipe, index){
        html+='<li class="removeItem"><label class="fullWidth">'+recipe+'</label><button class="removeBtn"><i class="fas fa-times-circle"></i></button></li>'
    })

    html+='</ul>'
    return html;
}

function createMealsDiv(meals, section){
    var list = createMealsList(meals, section);
    return list+
    '<div class="mealsInput"><input id="'+section+'-new-input" type="text" autocomplete="off" /><button class="addRecipe btn" type="button">Add</button></div>'
}

function createAllMeals(wholeDayMeals, res){
    var toReturn = Object.assign({}, wholeDayMeals);
    Object.keys(wholeDayMeals).forEach(function (key) {
        toReturn[key] = createMealsDiv(wholeDayMeals[key],key)
    })
    return toReturn;
}

function getRecipeWIngredients (recipeID) {
    if(mongoose.Types.ObjectId.isValid(recipeID)){
        //means we turn it into an object and search for it
        return Recipe.findOne(
            {
                _id: mongoose.Types.ObjectId(recipeID)
            },
            {
                name: 1,
                _id: 1,
                ingredients: 1
            }).exec();
    }
    else {
        return recipeID;
    }
}


//returns array of promises that needs to be waited on
function allSections (meals) {
    return meals.map(function(recipeID){
        return getRecipeWIngredients(recipeID)
    })
}

function allMeals (meals) {
    //first we get all promise arrays
    //need to make an object of arrays
    var mealsObj = {};

    Object.keys(meals).map(function (meal){
        mealsObj[meal] = Promise.all(meals[meal].map(function(mealArray){
            allSections(mealArray);
        }))
    });
    return mealsObj;
}

function promiseAllIds(daysArray) {
    var stack = [];
    var recipeNamePromises = [];

    daysArray.forEach(function (day, dayIndex) {
        //now we go through the keys in meal
        Object.keys(day.meals).forEach(function(mealKey){
            day.meals[mealKey].forEach(function(recipeID, mealIndex){
                var recipe = getRecipeWIngredients(recipeID);
                if( recipe && recipe.then){
                    
                    stack.push({
                        meal: mealKey,
                        mealIndex: mealIndex,
                        recipe: recipe,
                        dayIndex: dayIndex,
                        promiseIndex: recipeNamePromises.length
                    });
                    recipeNamePromises.push(recipe);
                }
            })
        })
    })

    return {promises: Promise.all(recipeNamePromises), newRecipeNames: stack};
}

function createMealsList( meals, section ) {
    //first check if any of the strings are IDs and get the titles
    var indexesChanged = [];
    var toRet = meals.slice();
    const ids = meals.filter(function(mealText, index){
        const willChange = mongoose.Types.ObjectId.isValid(mealText);
        if(willChange){
            indexesChanged.push(index);
        }
        return willChange;
    }).map(function (objIDString){
        return mongoose.Types.ObjectId(objIDString);
    });

    // console.log(toRet);
    if(ids.length > 0){
        return Recipe.recipesByIdArray(ids)
    }
    else {
        // console.log(turnNamesToListHTML(toRet, section));
        return turnNamesToListHTML(toRet, section);
    }
    
    //now we look to find all the names of the IDs

    //replace strings in the array with the <li>TEXT<button class="removeMeal"></button></li>

}

module.exports = {
    createMealsList: createMealsList,
    turnNamesToListHTML: turnNamesToListHTML,
    createMealsDiv: createMealsDiv,
    createAllMeals: createAllMeals,
    fetchRecipeNames: fetchRecipeNames,
    allMeals: allMeals,
    promiseAllIds:promiseAllIds
}