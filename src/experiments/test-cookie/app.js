var bodyParser = require('body-parser');
var connect = require('connect');
var configs = require('../../shared/configs/config');
var http = require('http');
var authenticatorRouter = require('./testAuth');
var genericRouter = require('./testGeneric');


var app = connect();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/logout', logOut);
app.use(authenticatorRouter);
app.use(genericRouter);

function logOut ( req, res, next){
    console.log('LOGGING OUT')
    var header = {
        'Set-Cookie': '',
        'Location': '/out.html'
    }
    res.writeHeader(302, header);
    res.end();
}

http.createServer(app).listen(configs.port, configs.host);
console.log('Available on:    '+ configs.host + ':'+configs.port);