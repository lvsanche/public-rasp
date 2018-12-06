var handleSignUpPost = require('./signUpPost');
var handleSignUpGet = require('./signUpGet');

function signUpRouter( req, res, next) {
    if( req.method === 'POST' && req.url === '/'){
        //must create the new user here.
        handleSignUpPost(req,res);
    }
    else if(req.method === 'GET' && req.url === '/'){
        handleSignUpGet(res);
    }
    else {
        next();
    }
}

module.exports = signUpRouter;