var User = require('../../models/user');
var mongoose = require('mongoose');
var renderSignInPage = require('../../signIn/controllers/signInGet').renderSignInPage;

function handleSignUpPost(req, res){
    var newUser = new User({
        _id: new mongoose.Types.ObjectId,
        email: req.body.email,
        name: {
            firstName: req.body.fname,
            lastName: req.body.lname
        },
        password: req.body.password
    }, function( err, user ) {
        if( err ){
            res.writeHead(500);
            res.end('User had issues getting created');
        }
    });

    newUser.save( function (err){
        if ( err ){
            console.log('User had issues getting saved');
            console.log(err);
            renderSignInPage(res, 'User Exists', req.body.email);
        }
        else {
            var header = {
                'Location': '/calendar/new',
                'Set-Cookie': newUser.generateJWT(),
            };
            
            res.writeHead(302, header);
            res.end();
        }
    });

}

module.exports = handleSignUpPost;