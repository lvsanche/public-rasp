var render = require('../../shared/helpers/render');
function newCalendar(req, res){
    res.writeHead(200, {'Content-Type': 'text/html'});
    var values = {
        specificScript : '<script src="/calendar/views/newCalendar.js"></script>', 
        centerLabel: '',
        navbarList: ''
    }
    var sections = {
        navbar: 'shared/modules/auth-navbar.html',
        main: 'calendar/views/newCalendar.html'
    }

    render.constructPage(
        'shared/templates/generic.html', 
        sections,
        values,
        res
    );
    res.end();
}

module.exports = newCalendar;