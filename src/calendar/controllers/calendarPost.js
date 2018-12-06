var Calendar = require('../../models/calendar');
var mongoose = require('mongoose');
var User = require('../../models/user');
var helpers = require('./helpers');
var utils = require('../../shared/helpers/utils');

const monthDays = [31,28,31,30,31,30,31,31,30,31,30,31];


function handleCalendarPost ( req, res, next){
    if ( req.url === '/fetchDates'){
        fetchDates( req, res);
    }
    else if( req.url === '/fetchDate'){
        fetchDate(req, res);
    }
    else if ( req.url === '/new'){
        postNewCalendar(req,res);
    }
    else {
        next();
    }
};



function calcFutureDate (startDate){
    // console.log(startDate);
    var endDate = startDate.getDate() + 7;
    var daysInMonth = monthDays[startDate.getMonth()];
    //must also check for the end of the year
    
    //first set the month value
    //then set the year value

    var endMonth = startDate.getMonth();
    var endYear = startDate.getFullYear();
    if(  endDate > daysInMonth  ){
        //means we are moving one month forward and possibly one year
        
        endDate = endDate % daysInMonth;
        if ( endMonth === 11) {
            //we need to go one month and go to Jan
            endMonth = 0;
            endYear+= 1;
        }
        else {
            endMonth+=1;
        }
    }

    return new Date(endYear, endMonth, endDate, 0,0,0,0);
}


//function returns promise to resolve week query
//calendarID comes in as a string
function queryWeek ( sundayDate , calendarID ){
    var startDate = utils.standardizeDate(sundayDate);
    var endDate = calcFutureDate(startDate);

    return Calendar.aggregate([{
        $match:{
            _id: mongoose.Types.ObjectId(calendarID)
        }},
        {
        $project: {
            days: {
                $filter: {
                    input: "$days",
                    as: "day",
                    cond: {
                        $and :[
                            { $gte: ["$$day.date", startDate]},
                            { $lt: ["$$day.date", endDate]}
                        ]
                    }
                }
            }
        }
    }]).exec();
}


function fetchDates(req, res){
    //will be route to get the dates, payload will have sunday's date
    var sundayDate = req.body.sundayDate;
    var calendarID = req.body.calendarID.substr(0,24);
    
    queryWeek(sundayDate, calendarID).then( function(output){
        // console.log(output)
        if( output[0]){
            var returnedObj = helpers.promiseAllIds(output[0].days);
            // console.log(returnedObj);
            returnedObj.promises.then(function(results){
                // console.log(results)
                //now we go through the stack and read results
                //go through the stack and update the meals obj
                returnedObj.newRecipeNames.forEach(function(changes){
                    output[0].days[changes.dayIndex].meals[changes.meal][changes.mealIndex] =
                    results[changes.promiseIndex];
                })
                // console.log(output[0].days[1])
                //now we send the data
                res.writeHead(200);
                res.write(JSON.stringify(output[0].days));
                res.end();
            })
        }
        else {
            res.writeHead(200);
            res.write(JSON.stringify({}));
            res.end();
        }
    });
}


function fetchDate(req, res){
    //will be route to get the dates, payload will have sunday's date
    // console.log(req.body.calendarID);
    var date = utils.standardizeDate(req.body.date);
    Calendar.aggregate([{
        $match:{
            _id: mongoose.Types.ObjectId(req.body.calendarID.substr(0,24))
        }},
        {
        $project: {
            days: {
                $filter: {
                    input: "$days",
                    as: "day",
                    cond: {
                         $eq: ["$$day.date", date]
                    }
                }
            }
        }
    }], function( err, output){
        if(err) {
            res.writeHead(500);
            res.end('Issue with calendar');
        }
        if( output[0].days.length > 0){
            //from here we call the meals prep turned into html
            // console.log('IN EHRE ')
            var returnedObj = helpers.promiseAllIds(output[0].days);
            returnedObj.promises.then(function(results){
                //now we go through the stack and read results
                //go through the stack and update the meals obj
                returnedObj.newRecipeNames.forEach(function(changes){
                    //location has the mealKey, index in the array
                    output[0].days[changes.dayIndex].meals[changes.meal][changes.mealIndex] =
                results[changes.promiseIndex];
                })

                //now we send the data
                res.writeHead(200);
                res.write(JSON.stringify(output[0].days[0].meals));
                res.end();
            })
        }
        else {
            res.writeHead(200);
            res.write(JSON.stringify({
                'breakfast':[],
                'lunch': [],
                'dinner': [],
                'snacks': []
            }))
            res.end();
        }
    });
}

function postNewCalendar(req, res) {

    //check if the incoming value is not already an object.
    const possibleObjId = mongoose.Types.ObjectId.isValid(req.body.calendar);
    if( possibleObjId ){
        //now we need to check if it is in the db
        const calendarID = mongoose.Types.ObjectId(req.body.calendar);
        Calendar.findOne({_id: calendarID}, function(err, doc){
            // console.log(doc);
            if( err ){
                res.writeHead(500);
                res.end('Issue with the Calendar ID');
            }
            if ( doc ) {
                //now we can push to the end of the array
                User.findOneAndUpdate({'email': req.headers['cookie'].email}, {
                    $push: {'calendars' : calendarID}
                }, function(err, doc){
                    if(err){
                        res.writeHead(500);
                        res.end('Issue adding calendar to current user');
                    }
                    res.writeHead(302, {'Location': '/calendar/'+calendarID})
                    res.end();
                });
            }
            else {
                res.writeHead(302, {
                    'Location': '/calendar/new'
                });
                res.end()
            }
        })
    }
    else{
        var newCalendar = new Calendar({
            _id: new mongoose.Types.ObjectId,
            name: req.body.calendar,
            authors: [
                mongoose.Types.ObjectId(req.headers['cookie'].id)
            ]
        }, function( err, calendar ) {
            if( err ){
                res.writeHead(500);
                res.end('Issue with the calendar');
            }
        });
        //saving calendar
        // console.log('Calendar: '+ newCalendar);
        newCalendar.save(function (err){
            if ( err ){
                res.writeHead(500);
                res.end('Issue saving the calendar');
            }
        });

        User.findOneAndUpdate({'email': req.headers['cookie'].email}, {
            $push: {'calendars' : newCalendar._id}
        }, function(err, doc){
            if(err){
                res.writeHead(500);
                res.end('Issue adding calendar to current user');
            }
            res.writeHead(302, {'Location': '/calendar/'+newCalendar._id})
            res.end();
        });
    }
};

module.exports = {
    handleCalendarPost: handleCalendarPost,
    calcFutureDate: calcFutureDate,
    queryWeek: queryWeek
};