function createMealsDiv(section){
    return '<div id="'+section+'" class="mealsSection"><ul id="'+section+'-list" class="mealsBlock"></ul>' +
    '<div class="mealsInput"><input id="'+section+'-new-input" type="text" autocomplete="off" /><button class="addRecipe btn" type="button">Add</button></div></div>'
}

module.exports = {
    createMealsDiv: createMealsDiv
}
