
var jwt = require('jsonwebtoken');
var secret = require('../configs/config').secret;

function isAuthenticated(req, res, next){
    // console.log(req.headers);
    // console.log("AUTH: "+req.url)
    // console.log('METHOD: '+req.method);
    if ( req.headers['cookie'] ){
        var cookieObj = parseCookie(req.headers['cookie']);
        if( cookieObj['access_token']){
            jwt.verify(cookieObj['access_token'], secret, function(err, decoded) {
                // console.log('Decoded cookie: ');
                if (err) {
                    // console.log('Non auth user');
                    console.log(err);
                    res.writeHead(302, { 'Location': '/signIn', 'Set-Cookie': ''});
                    res.end();
                }
                else {
                    // Object.keys(decoded).forEach(k => console.log(k+ ' ' +decoded[k]));
                    // console.log('Token verified');
                    req.headers['cookie'] = decoded;
                    next();
                }
            })
        }
    }
};

function parseCookie ( cookie ) {
    //break by ; and trim parts
    var values = cookie.split(';').map(val => val.trim()).filter( em => em !== '');
    var wholeObj = {};
    values.forEach( value => {
        var split = value.split('=').map(v=> v.trim());
        if ( split.length === 2 && split[0] !== '' && split[1] !== ''){
            wholeObj[split[0]] = split[1];
        }
    });

    return wholeObj;
}

module.exports = isAuthenticated;