var handleSignInPost = require('./signInPost');
var handleSignInGet = require('./signInGet').handleSignInGet;

function signInRouter( req, res, next) {
    console.log(req.url);
    if( req.method === 'POST' && req.url === '/'){
        handleSignInPost(req, res);
    }
    else if( req.method === 'GET' && req.url === '/'){
        handleSignInGet(res);
    }
    else { 
        next();
    }
}

module.exports = signInRouter;