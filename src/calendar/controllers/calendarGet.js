var User = require ('../../models/user');
var Calendar = require('../../models/calendar');
var render = require('../../shared/helpers/render');

function handleCalendarGet ( req, res, next ){
    //first will change the route to be the first calendar
    User.findOne({'email': req.headers['cookie'].email}, function (err, user){
        if( err ){
            console.log('Issue with the user in calendarGet')
            console.log(err);
            res.writeHead(500);
            res.end('Issue with the user find');
        }

        var calendarsList = "";
        //means the user does not have it 
        if(user.calendars.length < 1 ){
            //means we need to relocate to new calendar
            // console.log('No Calendar')
            res.writeHead(302, {
                'Location': '/calendar/new'
            });
            res.write()
            res.end();
        }
        else if ( req.url === '/' ){
            res.writeHead(302, {'Location': '/calendar/'+user.calendars[0].toString()});
            res.end();
        }
        else{
            Calendar.find({
                '_id': {
                    $in: user.calendars
                }}, function(err, calendars){
                if(err){
                    console.log(err);
                    res.writeHead(500);
                    res.end('Issue with the calendar find');
                }

                if(calendars.length < 1){
                    // console.log('LENGTH 0 inside')
                    res.writeHead(302, {'Location': '/calendar/new'});
                    res.end();
                }

                var currentCalendarName = calendars[0].name;

                //order the calendars by the user's calendar order
                user.calendars.forEach( function (calendarID){
                    //now find the matching calendar
                    var matched = calendars.find(function (calendar){
                        return calendar._id.toString() === calendarID.toString();
                    });

                    if ( matched ){
                        calendarsList +='<li><a href="/calendar/'+matched._id.toString()+'">'+ matched.name+'</a></li>';
                        if( matched._id.toString() === req.url.substr(1)){
                            currentCalendarName = matched.name;
                        }
                    }
                    
                });
    
                var values = {
                    specificScript : '<script src="/calendar/views/calendar.js"></script>',
                    centerLabel: currentCalendarName+'</label><label><i class="fas fa-chevron-down"></i>', //dirty fix for now TODO
                    navbarList: calendarsList,
                    addToCurrentCalendar: '/meals/new'+req.url,
                    shop: '/shop'+req.url
                }
                var sections = {
                    navbar: 'shared/modules/auth-navbar.html',
                    main: 'calendar/views/index.html'
                }
    
                render.constructPage(
                    'shared/templates/calendar.html', 
                    sections,
                    values,
                    res
                );
                res.end();
            });
        }  
    });
};



module.exports = handleCalendarGet;
