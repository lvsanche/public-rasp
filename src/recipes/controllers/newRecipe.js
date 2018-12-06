var render = require('../../shared/helpers/render');

function newRecipe(res){
    res.writeHead(200, {'Content-Type': 'text/html'});

    var values = {
        specificScript : '',
        centerLabel: '',
        navbarList: '',
    }
    var sections = {
        navbar: 'shared/modules/auth-navbar.html',
        main: 'recipes/views/addNewRecipe.html'
    }

    render.constructPage(
        'shared/templates/generic.html', 
        sections,
        values,
        res
    );
    
    res.end();
}

module.exports = newRecipe;