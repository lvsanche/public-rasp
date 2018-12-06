var expect = require('expect')
var ingredParsers = require('./ingredParser'); 

describe( 'scanIngredients', () => {
    it('handles array of strings', () => {
        var a = ['Pinch of kosher salt',
                '3 long sprigs rosemary',
                '1 Tbsp. all-purpose flour, plus more for dusting', 
                '1 large egg, beaten to blend',
                'Vanilla ice cream (for serving)'];
        var output = [
            { 'quantity': null, 'unit': 'pinch', 'ingredient': 'kosher salt' },
            { 'quantity': '3', 'unit': null, 'ingredient': 'sprigs rosemary' },
            { 'quantity': '1', 'unit': 'tablespoon', 'ingredient': 'all-purpose flour' },
            { 'quantity': '1', 'unit': null, 'ingredient': 'egg' },
            { 'quantity': null, 'unit': null, 'ingredient': 'vanilla ice cream' }
        ];
        expect(ingredParsers.scanIngredients(a)).toEqual(output);
    })

    it('handles empty array', () => {
        var a = [];
        var output = [];
        expect(ingredParsers.scanIngredients(a)).toEqual(output);
    })

    it('handles array of string with random inputs', () => {
        var a = ['Pinch of kosher salt', {}, 3];
        var output = [{ 'quantity': null, 'unit': 'pinch', 'ingredient': 'kosher salt' }];
        expect(ingredParsers.scanIngredients(a)).toEqual(output);
    })

    it('handles non matching ingredients', () => {
        var a = ['1 cup fake items'];
        var output = [{ 'quantity': '1', 'unit': 'cup', 'ingredient': 'fake items' }];
        expect(ingredParsers.scanIngredients(a)).toEqual(output);
    })
});


describe( 'scanRecipes', () => {
    it('handles empty array of recipes', () => {
        var recipes = [];
        var output = {};
        expect(ingredParsers.scanRecipes(recipes)).toEqual(output);
    })

    it('handles array with seperate valid recipes', () => {
        var recipes = [
            {'_id': 123, 'url': 'www.test.com/123', 'name': 'Test1', 'ingredients' : [
                '1 cup flour', '2 cups melted butter'
            ], 'steps': ['test', 'test2'], 'servings': 'test'
            },{'_id': 234, 'url': 'www.test.com/234', 'name': 'Test2', 'ingredients' : [
                '1 lb potatoes'
            ], 'steps': ['test', 'test4'], 'servings': 'test'}
        ];
        var output = {
            'flour': {
                'total': {
                'unit': 'cup',
                'quantity': '1'
            },
            'recipes': [
                {
                    'name': 'Test1',
                    'url': '/recipes/123',
                    'unit': 'cup',
                    'quantity': '1'
                }
            ]},
            'melted butter': {
                'total': {
                    'unit': 'cup',
                    'quantity': '2'
                },
                'recipes': [
                    {
                        'name': 'Test1',
                        'url': '/recipes/123',
                        'unit': 'cup',
                        'quantity': '2'
                    }
                ]
            },
            'potato': {
                'total': {
                    'unit': 'pound',
                    'quantity': '1'
                },
                'recipes': [
                    {
                        'name': 'Test2',
                        'url': '/recipes/234',
                        'unit': 'pound',
                        'quantity': '1'
                    }
                ]
            }
        };
        expect(ingredParsers.scanRecipes(recipes)).toEqual(output);
    })

    it('handles array with combined valid recipes', () => {
        var recipes = [
            {'_id': 123, 'url': 'www.test.com/123', 'name': 'Test1', 'ingredients' : [
                '1 cup flour', 'pinch of salt'
            ], 'steps': ['test', 'test2'], 'servings': 'test'
            },{'_id': 234, 'url': 'www.test.com/234', 'name': 'Test2', 'ingredients' : [
                '2 cup flour', 'pinch of salt'
            ], 'steps': ['test', 'test2'], 'servings': 'test'}
        ];

        var output = {
            'flour': {
                'total': {
                'unit': 'cup',
                'quantity': '3'
            },
            'recipes': [
                {
                    'name': 'Test1',
                    'url': '/recipes/123',
                    'unit': 'cup',
                    'quantity': '1'
                },
                {
                    'name': 'Test2',
                    'url': '/recipes/234',
                    'unit': 'cup',
                    'quantity': '2'
                }
            ]},
            'salt': {
                'total': {
                'unit': null,
                'quantity': null
            },
            'recipes': [
                {
                    'name': 'Test1',
                    'url': '/recipes/123',
                    'unit': 'pinch',
                    'quantity': null
                },
                {
                    'name': 'Test2',
                    'url': '/recipes/234',
                    'unit': 'pinch',
                    'quantity': null
                }
            ]}
        };
        
        expect(ingredParsers.scanRecipes(recipes)).toEqual(output);

    });

    it('handles invalid recipes', () => {
        var recipes = [
            {}, {'test': 'test', 'asd': 'asdf'}, { 'ingredients': ['a', 1, {}]} 
        ];
        var output = {};
        expect(ingredParsers.scanRecipes(recipes)).toEqual(output);
    })

    it('handles recipes with new ingredients', () => {
        var recipes = [
            {'_id': 123, 'url': 'www.test.com/123', 'name': 'Test1', 'ingredients' : [
                '1 cup fake ingredient'
            ], 'steps': ['test', 'test2'], 'servings': 'test'
            },{'_id': 234, 'url': 'www.test.com/234', 'name': 'Test2', 'ingredients' : [
                '2 cup fake ingredient'
            ], 'steps': ['test', 'test2'], 'servings': 'test'}
        ];

        var output = {
            'fake ingredient': {
                'total': {
                'unit': 'cup',
                'quantity': '3'
            },
            'recipes': [
                {
                    'name': 'Test1',
                    'url': '/recipes/123',
                    'unit': 'cup',
                    'quantity': '1'
                },
                {
                    'name': 'Test2',
                    'url': '/recipes/234',
                    'unit': 'cup',
                    'quantity': '2'
                }
            ]}
        };
        
        expect(ingredParsers.scanRecipes(recipes)).toEqual(output);
    })
})
