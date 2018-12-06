var helpers = require('./helpers')
var expect = require('expect')

describe( 'standardizeServings', () => {
    it('handles single servings', () => {
        var str = 'Makes 4 servings';
        var str1 = "Original recipes makes 12 servings";

        expect(helpers.standardizeServings(str)).toBe("4 servings");
        expect(helpers.standardizeServings(str1)).toBe("12 servings");
    })

    it('handles dashed servings', () =>{
        var str = 'Makes 4-6 servings';
        var str1 = "Original recipes makes 1-2 servings";

        expect(helpers.standardizeServings(str)).toBe("4-6 servings");
        expect(helpers.standardizeServings(str1)).toBe("1-2 servings");
    })

    it('handles 1 serving', () => {
        var str = 'Makes 1 servings';
        var str1 = "Original recipes makes 1 serving";

        expect(helpers.standardizeServings(str)).toBe("1 serving");
        expect(helpers.standardizeServings(str1)).toBe("1 serving");
    })

    it('handles -to- servings', () => {
        var str = '4 to 6 servings';
        var str1 = "Original recipes makes 3 to 6 servings";

        expect(helpers.standardizeServings(str)).toBe("4-6 servings");
        expect(helpers.standardizeServings(str1)).toBe("3-6 servings");
    })

    it('handles no serving text', () => {
        var str = 'Makes servings';
        var str1 = "Original recipes makes serving";
        var str2 = "";
        var str3 = null;

        expect(helpers.standardizeServings(str)).toBe("N/A");
        expect(helpers.standardizeServings(str1)).toBe("N/A");
        expect(helpers.standardizeServings(str2)).toBe("N/A");
        expect(helpers.standardizeServings(str3)).toBe("N/A");
    })
})