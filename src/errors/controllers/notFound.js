var render = require('../../shared/helpers/render');

function notFoundRouter( req, res, next) {
    res.writeHead(404, {'Content-Type': 'text/html'});

    var values = {
    }
    var sections = {
        main: 'errors/views/notFound.html'
    }
    render.constructPage(
        'shared/templates/error.html', 
        sections,
        values,
        res
    );
    res.end();
}

module.exports = {
    router: notFoundRouter
};