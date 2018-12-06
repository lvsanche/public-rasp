var render = require('../../shared/helpers/render');

function handleSignInGet ( res ){
    renderSignInPage(res, null, null);
}

function renderSignInPage( res, error, email ){
    res.writeHead(200, {'Content-Type': 'text/html'});

    var values = {
        specificScript : '<script src="/signIn/views/signIn.js"></script>',
        cardHeader: (error) ? error : 'Sign In!',
        headerClass: (error) ? 'error-text' : '',
        email: (email) ? email : ''
    }
    var sections = {
        navbar: 'shared/modules/navbar.html',
        main: 'signIn/views/index.html',
    }
    render.constructPage(
        'shared/templates/generic.html', 
        sections,
        values,
        res
    );
    res.end();
};

module.exports = {
    handleSignInGet: handleSignInGet,
    renderSignInPage: renderSignInPage
};
