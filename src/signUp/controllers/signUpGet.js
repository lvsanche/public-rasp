var render = require('../../shared/helpers/render');

function handleSignUpGet (res){
    res.writeHead(200, {'Content-Type': 'text/html'});

    var values = {
        specificScript : '<script src="/signUp/views/signUp.js"></script>'
    }
    var sections = {
        navbar: 'shared/modules/navbar.html',
        main: 'signUp/views/index.html'
    }
    render.constructPage(
        'shared/templates/generic.html', 
        sections,
        values,
        res
    );
    res.end();
}

module.exports = handleSignUpGet;