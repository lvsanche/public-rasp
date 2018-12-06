var render = require('../../shared/helpers/render');

function aboutRouter( req, res, next) {
    // console.log(req.url);
    if( req.url === '/'){
        res.writeHead(200, {'Content-Type': 'text/html'});

        var values = {
            specificScript : ''
        }
        var sections = {
            navbar: 'shared/modules/navbar.html',
            main: 'about/views/index.html'
        }
        render.constructPage(
            'shared/templates/generic.html', 
            sections,
            values,
            res
        );
        res.end();
    }
    else
        next();
}

module.exports = aboutRouter;