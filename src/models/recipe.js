const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var RecipeSchema = new Schema({
    _id: Schema.Types.ObjectId,
    url: { type: String,
        unique: true,
        required: true,
        dropDups: true },
    name: {type: String},
    ingredients: [ {
        header: String,
        ingredients: [ String ]
    } ],
    steps: [
        String
    ],
    servings: String
});

RecipeSchema.index({
    'name': 'text',
    'ingredients': 'text',
});

RecipeSchema.statics.recipesByIdArray = function(idArray){
    return this.find({
        '_id': {
            $in: idArray
        }
    })
    .select({"name": 1, "_id": 1, "ingredients": 1})
    .exec();
}

var Recipe = mongoose.model('Recipe', RecipeSchema);
Recipe.on('index', function (err, r){
    if(err){
        console.log(err)
    }
})

/**
 * Info regarding tags and browsing queries
 * Seafood: 'fish', 'salmon', 'shrimp', 'clams',
 * Poultry: 'chicken', 'egg',
 * Red Meat: 'beef', 
 * Salads: 'salad'
 * Pasta: 'pasta'
 */
module.exports = Recipe;