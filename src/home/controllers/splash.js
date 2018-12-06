var render = require('../../shared/helpers/render');

function splashRouter( req, res, next) {
    console.log(req.url);
    if( req.url === '/'){
        res.writeHead(200, {'Content-Type': 'text/html'});

        var splashValues = {
            specificScript : ''
        }
        var splashSections = {
            navbar: 'shared/modules/navbar.html',
            main: 'home/views/index.html'
        }
        render.constructPage(
            'shared/templates/generic.html', 
            splashSections,
            splashValues,
            res
        );
        res.end();
    }
    else
        next();
}

module.exports = splashRouter;