var render = require('../../shared/helpers/render');
var Calendar = require('../../models/calendar');
var mongoose = require('mongoose');
var helpers = require('./helpers');
var utils = require('../../shared/helpers/utils');
const months = [ {month:"Jan", days: 31},{month: "Feb",days: 28}, {month: "Mar", days: 31},
{month: "Apr", days: 30}, {month: "May", days: 31}, {month: "Jun", days: 30}, {month: "Jul", days: 31},
{month: "Aug", days: 31}, {month: "Sep", days: 30}, {month: "Oct", days: 31}, {month: "Nov", days: 30},
{month: "Dec", days: 31} ]; 

function addNewMealPage(req, res){
    var calendarID = req.url.split('/')[2];
    var sundayDateString = req.url.split('/')[3];
    // console.log(sundayDateString);
    var sundaySplit = sundayDateString.split('-');
    var sundayDate = sundaySplit[2];
    var month = months[parseInt(sundaySplit[1])-1].month;
    //check if the current date is in the calendar
    Calendar.aggregate([{
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
                            $eq: ["$$day.date", utils.standardizeDate(sundayDateString)]
                    }
                }
            }
        }
    }] ,function( err, output){
        if(err) {
            res.writeHead(500);
            res.end('Issue with calendar');
        }
        // console.log(output);
        var meals = (output[0].days.length === 1) ? output[0].days[0].meals : false;

        //meals string arrays must be processed
        console.log(meals);
        var values = {
            specificScript : '<script src="/meals/views/newMeals.js"></script>',
            centerLabel: '',
            navbarList: '',
            sundayValue: sundayDateString,
            sundayDate: sundayDate,
            month: month,
            breakfast: helpers.createMealsDiv('breakfast') ,
            lunch: helpers.createMealsDiv('lunch') ,
            dinner: helpers.createMealsDiv('dinner') ,
            snacks: helpers.createMealsDiv('snacks') 
        }
        var sections = {
            navbar: 'shared/modules/auth-navbar.html',
            main: 'meals/views/addNewMeal.html'
        }
    
        render.constructPage(
            'shared/templates/generic.html', 
            sections,
            values,
            res
        );
        res.end();
    });



    
}

module.exports = addNewMealPage;