var helpers = require('./helpers');
var expect = require('expect');

describe('createMealsDiv', () => {
    it('handles section header', () => {
        var section = 'breakfast'
        var output = '<div id="breakfast" class="mealsSection"><ul id="breakfast-list" class="mealsBlock"></ul>' +
        '<div class="mealsInput"><input id="breakfast-new-input" type="text" autocomplete="off" /><button class="addRecipe btn" type="button">Add</button></div></div>'
    
        expect(helpers.createMealsDiv(section)).toEqual(output);
    })
})