var toTest = require('./calendarPost');
var expect = require('expect');

describe ( 'calculates future dates', () => {
    it('handles in month future date', () => {
        var input = new Date(2018, 10, 4);
        var output = new Date(2018, 10, 11);
        console.log(input);
        console.log(toTest.calcFutureDate(input));
        expect(toTest.calcFutureDate(input)).toEqual(output);
    })
    it('handles next month future date', () => {
        var input = new Date(2018, 10, 25);
        var output = new Date(2018, 11, 2);
        console.log(toTest.calcFutureDate(input));
        expect(toTest.calcFutureDate(input)).toEqual(output);
    })
    it('handles next year future date', () => {
        var input = new Date(2018, 11, 30);
        var output = new Date(2019, 0, 6);
        console.log(toTest.calcFutureDate(input));
        expect(toTest.calcFutureDate(input)).toEqual(output);
    })
})