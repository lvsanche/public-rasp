function settingsEditCalendars( req, res, next) {
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
            
                calendars.forEach( (calendar) => {
                    calendarOptions +='<option value=' +calendar._id +'>'+ calendar.name + '</option>';
                });

                var values = {
                    specificScript : '',
                    calendarOptions: calendarOptions,
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

module.exports = settingsEditCalendars;