var render = require('../../shared/helpers/render');
var Calendar = require('../../models/calendar');
var User = require('../../models/user');
var mongoose = require('mongoose');

function settingsGet( req, res, next) {
    console.log(req.url);
    if( req.url === '/'){
        res.writeHead(200, {'Content-Type': 'text/html'});

        User.findById(mongoose.Types.ObjectId(req.headers['cookie'].id), function(err, user){
            if(err){
                console.log(err);
                res.writeHead(500);
                res.end('Issue with the calendar find');
            }

            var calendarPromises = user.calendars.map ( function ( calendarID) {
                return Calendar.findById(calendarID).exec();
            })
            
            Promise.all(calendarPromises).then( function (calendars){
                var calendarOptions = '';
                var removeCalendars = '';
                calendars.forEach( (calendar) => {
                    calendarOptions +='<option value=' +calendar._id +'>'+ calendar.name + '</option>';
                    removeCalendars +='<li class="removeItem"><label class="fullWidth">'+calendar.name+'</label><button class="removeBtn" type="button"><i class="fas fa-times-circle"></i></button></li>'
                });

                var values = {
                    specificScript : '<script src="/settings/views/settings.js"></script>',
                    calendarOptions: calendarOptions,
                    removeCalendars: removeCalendars,
                    initialCalendar: calendars[0]._id,
                    centerLabel: '',
                    navbarList: ''
                }
                var sections = {
                    navbar: 'shared/modules/auth-navbar.html',
                    main: 'settings/views/settings.html'
                }
    
                render.constructPage(
                    'shared/templates/generic.html', 
                    sections,
                    values,
                    res
                );
                res.end();
            })
        });
    }
    else
        next();
}

module.exports = settingsGet;