var sizes = [ 'lb. ', 'large ', 'Tbsp. ', 'cups ', 'cup ', 'small ', 'medium ', 'tsp. ', 'ripe ', 'bunch ', 'piece ', 'teaspoon ',
'teaspoons ', 'tablespoon ', 'tablespoons ', 'boneless ', 'oz. ', 'Pinch of ', 'head ' ];

function sendRecipeRequest(change){

    var search = document.getElementById('recipe-search').value;
    var page = parseInt(document.getElementById('pageNumber').textContent);
    
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/recipes/fetchRecipes", true);
    
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(xhttp.responseText);
            var recipes = JSON.parse(xhttp.responseText);
            
            document.getElementById('pageNumber').textContent = page + 1;
            //must disable next button if the recipes length < 10;
            // console.log(recipes)
            document.getElementById('results-forward').disabled = (recipes.length < 10 ) ? true : false;
            // console.log(recipes);
            scroll(0,0);
            addRecipesToDOM(recipes);
        }
    };
    if ( change === -1 ){
        page = page - 2;
    }
    else if ( change === 0){
        page = 0;
    }

    // console.log(page)
    xhttp.send("search="+search+'&page='+page);
}

function initialLoad () {
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/recipes/fetchRecipes", true);
    
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(xhttp.responseText);
            var recipes = JSON.parse(xhttp.responseText);
          
            document.getElementById('results-forward').disabled = (recipes.length < 10 ) ? true : false;
            addRecipesToDOM(recipes);
        }
    };
    xhttp.send("search=&page=0");
}

//recipes must be an array
function addRecipesToDOM(recipes){
    var anchorElement = document.getElementById("main-content");
    anchorElement.innerHTML = '';
    recipes.forEach(recipe => {
        //will create a div with the info and append to the id =main-content

        var newRecipe = document.createElement('div');

        var newTitle = document.createElement('a');
        newTitle.href= "/recipes/"+recipe._id;
        newTitle.className = "title"
        var removeItem = document.createTextNode(recipe.name);
        newTitle.appendChild(removeItem);
        newRecipe.appendChild(newTitle);

        var ingreds = []
        //must go through the ingredients, strip and show a list of items
        
        recipe.ingredients.forEach( ingredientObj => {
            ingredientObj.ingredients.forEach(ingredient => {
                var i;
                sizes.forEach( size => {
                    
                    i = ingredient.indexOf(size);
                    // console.log(size);
                    if( i >= 0){
                        
                        // console.log(ingredient);
                        ingredient = ingredient.substr(i+size.length);
                        // console.log(ingredient);
                    }
                });
                
                i = ingredient.indexOf(',');
                if( i >= 0){
                    ingredient = ingredient.substring(0,i);
                }
                i = ingredient.indexOf('(');
                if( i >= 0){
                    ingredient = ingredient.substring(0,i);
                }
                i = ingredient.indexOf('plus');
                if( i >= 0){
                    ingredient = ingredient.substring(0,i);
                }
                ingredient = ingredient.replace(/^\d+\s*/, '');
                
                ingreds.push(ingredient.trim());
            });
        });
        
        var ingredientsElement = document.createElement('p');
        ingredientsElement.className = "description completePadding";
        var ingredientText = document.createTextNode(ingreds.join(', '));
        ingredientsElement.appendChild(ingredientText);
        newRecipe.appendChild(ingredientsElement);
        newRecipe.className = "stackedContainer";
        
        anchorElement.appendChild(newRecipe);
    })
}

function closeSearchBox() {
    document.getElementById('navbar-list').classList.remove('is-visible');
    document.getElementById('navbar-list').classList.add('is-hidden');
}


initialLoad();
var forwardButton = document.getElementById('results-forward');
//get page number
forwardButton.addEventListener('click', () => sendRecipeRequest(1));
var backwardButton = document.getElementById('results-back');
backwardButton.addEventListener('click', () => sendRecipeRequest(-1));



var searchField = document.getElementById('recipe-search');
searchField.addEventListener('keypress', (event) => {
    // console.log(event);
    if( event.key === 'Enter')
        closeSearchBox();
    sendRecipeRequest(0)
});