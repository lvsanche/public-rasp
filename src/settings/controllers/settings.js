var settingsGet = require('./settingsGet');
var settingsPost = require('./settingsPost');
var settingsEditCalendars = require('./editCalendars');

function settingsRouter (req, res, next){
    console.log(req.url);
    if (req.method === 'POST'){
        settingsPost(req, res, next);
    }
    else if( req.method === 'POST' && req.url === '/editCalendars') {
        settingsEditCalendars(req, res, next);
    }
    else if( req.method === 'GET') {
        settingsGet(req, res, next);
    }
    else
        next();
}


module.exports = settingsRouter;