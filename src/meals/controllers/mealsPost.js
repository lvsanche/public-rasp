var mongoose = require('mongoose');
var Calendar = require('../../models/calendar');
var utils = require('../../shared/helpers/utils');

function handleMealsPost( req, res) {
     //we need to process the data
     var date = utils.standardizeDate(req.body.date);
     var meals = {
         breakfast: req.body.breakfast.split('//').filter(x => x),
         lunch: req.body.lunch.split('//').filter(x => x),
         dinner: req.body.dinner.split('//').filter(x => x),
         snacks: req.body.snacks.split('//').filter(x => x)
    };
    //  console.log('Here are the meals: ')
    //  console.log(meals);
     //findUpdate
     var urlArray = req.url.split('/');
     var calendarID = urlArray[2];
     // console.log(calendarID);
     Calendar.findOne( {'_id': mongoose.Types.ObjectId(calendarID)}, function(err, result){
         if(err) console.log(err);
         // console.log('NEW DOC: '+ result);
         //console.log(result.days)
         var newDays = updateMeal(result.days.slice(), date, meals);
         result.days = newDays;
         result.save(function(err){
             if(err) console.log(err);
         });
         //console.log('Here are the updated days: '+ result.days);
         //console.log('Changes occured');
         console.log(meals);
         res.writeHead(302, {'Location': '/calendar/'+calendarID});
         res.end();
     });
}

function updateMeal ( arrayDay, date, newMeals){
    var matchingDate = arrayDay.map( day => day.date.getTime()).indexOf(date.getTime());
    //console.log('HERE ARE THE UPDATE: '+matchingDate)
    if ( matchingDate === -1){
        //update date
        arrayDay.push({date: date, meals: newMeals})
    }
    else{
        //console.log(arrayDay[matchingDate])
        arrayDay[matchingDate] = {date: date, meals: newMeals};
    }
    return arrayDay;
}

module.exports = handleMealsPost;