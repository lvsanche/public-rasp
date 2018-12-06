const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var CalendarSchema = new Schema({
    _id: Schema.Types.ObjectId,
    name: String,
    authors: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    days: [
        {
            date: Date, 
            //eventually meals will be either an object with just simple text or a link to recipe
            meals: {
                breakfast: [String],
                lunch: [String],
                dinner: [String],
                snacks: [String]
            }
        }
    ]
});

var Calendar = mongoose.model('Calendar', CalendarSchema);
module.exports = Calendar;