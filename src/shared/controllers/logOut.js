
function logOut (req, res, next){
    var date = new Date();

    var header = {
        'Location': '/',
        'Set-Cookie': 'access_token=;expires='+date.toGMTString()+';'
    }
    res.writeHeader(302, header);
    res.end();
};

module.exports = logOut;