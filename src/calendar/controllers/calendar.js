var handleCalendarPost = require('./calendarPost');
var handleCalendarGet = require('./calendarGet');
var handleNewCalendarGet = require('../controllers/newCalendar');

function calendarRouter(req, res, next){
    if (req.method === 'POST'){
       handleCalendarPost.handleCalendarPost(req, res, next);
    }
    else if ( req.method === 'GET' && req.url === '/new'){
        handleNewCalendarGet(req, res);
    }
    else {
        handleCalendarGet(req, res);
    }
}

module.exports = calendarRouter;
