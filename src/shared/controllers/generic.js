//middleware used to handle routing
var fs = require('fs');
var path = require('path');
var notFound = require('../../errors/controllers/notFound');

function genericRouter(req, res, next) {
    //must have checks for the routes that are for each route

    var filePath = req.url;
    var extname = String(path.extname(filePath)).toLowerCase();
    // console.log(filePath);
    // console.log(req.headers);
    // console.log(req.method);
    if( req.method === 'GET' && extname !== '.html' && extname !== ''){
        var mimeTypes = {
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.svg': 'application/image/svg+xml'
        };

        // console.log('before: '+filePath)
        var contentType = mimeTypes[extname] || 'application/octet-stream';
        filePath = path.resolve(__dirname, '../../'+filePath);

        // console.log('Generic: '+  filePath);
        fs.readFile(filePath, function(error, content) {
            if (error) {
                if(error.code == 'ENOENT') {
                    notFound.router(req, res, next);
                }
                else {
                    res.writeHead(500);
                    res.end('Sorry, check with the site admin for error: '+error.code+' ..\n');
                }
            }
            else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(content, 'utf-8');
            }
        });
    }
    else{
        next();
    }        
}    
    
module.exports = genericRouter;