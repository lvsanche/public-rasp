var render = require('../../shared/helpers/render');
var Recipe = require('../../models/recipe');
var User = require ('../../models/user');
var Calendar = require('../../models/calendar');

function getAllRecipes(res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    var values = {
        specificScript : '<script src="/recipes/views/recipes.js"></script>',
        centerLabel: '<label>Search</label><i class="fas fa-chevron-down"></i>',
        navbarList: '<li><input id="recipe-search" type="text" placeholder="Search" name="search"/></li>',
    }
    var sections = {
        navbar: 'shared/modules/auth-navbar.html',
        main: 'recipes/views/recipes.html'
    }

    render.constructPage(
        'shared/templates/generic.html', 
        sections,
        values,
        res
    );
    res.end();
}


function getRecipe(req, res){
    var recipeID = req.url.substr(1);

    Recipe.findById(recipeID, function(err, recipe){
        if( err ){
            res.writeHead(500);
            res.end(err);
        }

        //must go through the ingredients
        var ingredients = "";
        recipe.ingredients.forEach(function(ingredObj){
            if ( ingredObj.header !== 'Ingredients'){
                ingredients += '<h4 class="long-form-subheader">'+ingredObj.header+'</h4>'
            }
    
            //now organize the array
            ingredObj.ingredients.forEach( function ( ingred, i  ){
                ingredients+='<li>'+ingred+'</li>';
            })
        })

        var steps = "";
        recipe.steps.forEach(function(step){
            steps+= '<li>'+step+'</li>';
        })


        //return a recipe page
        res.writeHead(200, {'Content-Type': 'text/html'});
        var values = {
            specificScript : '',
            centerLabel: '',
            navbarList: '',
            name: recipe.name,
            url: 'https://'+recipe.url,
            servings: recipe.servings,
            ingredients: ingredients,
            steps: steps,
            recipeID: recipe._id
        }
        var sections = {
            navbar: 'shared/modules/auth-navbar.html',
            main: 'recipes/views/singleRecipe.html'
        }

        render.constructPage(
            'shared/templates/generic.html', 
            sections,
            values,
            res
        );
        res.end();

    })
}

function addToCalendar(req, res){
    //parse the id
    //need to gather the different calendars here and paste
    User.findOne({'email': req.headers['cookie'].email}, function (err, user){
        if( err ){
            console.log(err);
            res.writeHead(500);
            res.end('Issue with the user');
        }
        
        Calendar.find({ _id:{
            $in: user.calendars
        }}, function(err, calendars){
            if(err){
                console.log(err);
                res.writeHead(500);
                res.end('Issue with the calendar find');
            }
            var calendarsList = "";
            //organize by user's calendar order
            user.calendars.forEach ( calendarID => {
                //now search for calendarName
                var matchedCalendar = calendars.filter(function (calendar){
                    return calendar._id.toString() === calendarID.toString();
                });

                if( matchedCalendar.length === 1)
                {
                    var name = matchedCalendar[0].name;
                    calendarsList +='<option value="'+calendarID.toString()+'">'+name+'</option>';
                }
            })

            res.writeHead(200, {'Content-Type': 'text/html'});
            var values = {
                specificScript : '<script src="/shared/modules/calendar/calendar.js"></script>'+
                '<script src="/recipes/views/addToCalendar.js"></script>',
                centerLabel: '',
                navbarList: '',
                calendarOptions: calendarsList        
            }
            var sections = {
                navbar: 'shared/modules/auth-navbar.html',
                main: 'recipes/views/addToCalendar.html',
                calendar: 'shared/modules/calendar/calendar.html',
            }

            render.constructPage(
                'shared/templates/generic.html', 
                sections,
                values,
                res
            );
            res.end();
                    
        });

    });
}

module.exports = {
    getAllRecipes: getAllRecipes,
    getRecipe: getRecipe,
    addToCalendar: addToCalendar
};
