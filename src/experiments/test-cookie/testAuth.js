var jwt = require('jsonwebtoken');
var secret = require('../../shared/configs/config').secret;

function isAuthenticated(req, res, next){
    console.log('Cookie: '+req.headers['cookie']);
    if ( req.method === 'POST'){
        var auth = genAuth(req.body.email);
        res.writeHead(302, {
            'Set-Cookie': "auth="+auth+"; HttpOnly",
            'Location': '/home.html'
        });
        res.end();
    }
    else {
        //need to break down the cookie
        if (req.headers['cookie']){
            console.log('TEST: '+req.headers['cookie']);
            var newObj = parseCookie(req.headers['cookie']);
            console.log(newObj);
    
            jwt.verify(newObj['auth'], secret, function(err, decoded) {
                console.log('Decoded cookie: ');
                if( decoded ){
                    Object.keys(decoded).forEach(k => console.log(k+ ' ' +decoded[k]));
                }
                next();
            })
        }
        else{
            next();
        }
        
    }
};

function parseCookie(cookie){
    if ( cookie !== '' || typeof cookie === 'undefined' ){
        var split = cookie.split(';');
        var obj = {};
        split.forEach(t => {
            var key = t.split("=");
            var trimmed = key.map(f => f.trim());
            obj[trimmed[0]] = trimmed[1];
        })
        return obj;
    }
    
}

function genAuth (email) {
    var today = new Date();
    var exp = new Date(today);
    exp.setDate(today.getDate() + 60);

    return jwt.sign({
    email: email,
    exp: parseInt(exp.getTime() / 1000),
    }, secret);

};
module.exports = isAuthenticated;