var User = require('../../models/user');
var renderSignInPage = require('./signInGet').renderSignInPage;

function handleSignInPost( req, res){
    //use the User schema to find the user email
    User.findOne({email: req.body.email}, function (err, user){
        if(err) {
            res.writeHead(500);
            res.end('Issue signing in');
        }
        // console.log(user);
        if( user ){
            if ( user.validPassword(req.body.password) ){
                
                console.log('PASSWORD MATCHES')
                //helpers.initialCalendar(req, res, user);
                var header = {
                    'Location': '/calendar',
                    'Set-Cookie': user.generateJWT(),
                };
                res.writeHead(302, header);
                res.end();
            }
            else{
                console.log('PASSWORD Does NOT MATCHES')
                //user has incorrect password
                renderSignInPage(res, 'Email or password incorrect', req.body.email);
            }
        }
        else {
            renderSignInPage(res, 'User Not Found', req.body.email);
        }

    });
};

module.exports = handleSignInPost;