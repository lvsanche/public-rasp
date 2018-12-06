var render = require('../../shared/helpers/render');
var User = require('../../models/user');
var mongoose = require('mongoose');

function settingsPost( req, res, next) {
    
    if( req.url === '/'){
        console.log(req.body)
        //we will pull from the array and push to the 0 position
        const userID = mongoose.Types.ObjectId(req.headers['cookie'].id);
        const calendarID = mongoose.Types.ObjectId(req.body.default);
        User.update({_id: userID}, {
            $pull: {
                calendars: calendarID 
            }
        }, function ( err, pulledCalendar){
            if(err){
                console.log(err);
                res.writeHead(500);
                res.end('Issue Calendar Array in the User');
            }
            // console.log(pulledCalendar);
            User.update({_id: userID}, {
                $push: {
                    calendars: {
                        $each: [ calendarID],
                        $position: 0
                    }
                }
            }, function (err, final){
                if(err){
                    console.log(err);
                    res.writeHead(500);
                    res.end('Issue Updating Users calendar');
                }
                // console.log(final);
                res.writeHead(302, {'Location': '/calendar'});
                res.end();
            })
        })
    }
    else
        next();
}

module.exports = settingsPost;