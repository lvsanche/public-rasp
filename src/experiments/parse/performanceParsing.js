const {
    performance,
    PerformanceObserver
} = require('perf_hooks');
// const util = require('util');
// const debug = util.debuglog('performance');

var randomOrder = {
    "oil": [
        "avocado oil",
        "coconut oil",
        "peanut oil",
        "sesame oil",
        "canola oil",
        "grapeseed oil",
        "vegetable oil",
        "cooking oil",
        "neutral oil",
        "walnut oil",
        "extra-virgin olive oil",
        "extra-virgin oil olive",
        "oil olive",
        "olive oil",
        "oil"
    ],
    "olive": [
        "picual olive",
        "black olive",
        "olive"
    ]
};

var longFirst = {
    "olive": [
        "picual olive",
        "black olive",
        "olive"
    ],
    "oil": [
        "extra-virgin olive oil",
        "extra-virgin oil olive",
        "grapeseed oil",
        "vegetable oil",
        "avocado oil",
        "coconut oil",
        "cooking oil",
        "neutral oil",
        "peanut oil",
        "sesame oil",
        "canola oil",
        "walnut oil",
        "oil olive",
        "olive oil",
        "oil"
    ]
}

var longLast = {
    "oil": [
        "oil",
        "oil olive",
        "olive oil",
        "walnut oil",
        "peanut oil",
        "sesame oil",
        "canola oil",
        "avocado oil",
        "cooking oil",
        "neutral oil",
        "coconut oil",
        "grapeseed oil",
        "vegetable oil",
        "extra-virgin olive oil",
        "extra-virgin oil olive",
    ],
    "olive": [
        "olive",
        "black olive",
        "picual olive",
    ]
}

var longList = {
    "ingredients": {
        "almond": [
            "almond butter",
            "almonds",
            "almond"
        ],
        "apple": [
            "sweet-tart apple",
            "pink lady apple",
            "honeycrisp apple",
            "winesap apple",
            "apple"
        ],
        "artichoke": [
            "artichoke"
        ],
        "asparagus": [
            "asparagus"
        ],
        "avocado": [
            "avocado"
        ],
        "bacon": [
            "bacon fat",
            "bacon"
        ],
        "basil": [
            "dried basil leaves",
            "basil leaves",
            "basil sprigs",
            "fresh basil",
            "sprigs basil",
            "basil"
        ],
        "bay": [
            "bay leaf",
            "bay leaves"
        ],
        "bean": [
            "pinto beans",
            "lima beans",
            "black beans",
            "refried beans",
            "peruvian beans",
            "beans",
            "bean"
        ],
        "beef": [
            "ground beef",
            "beef chuck",
            "beef broth",
            "beef"
        ],
        "beer": [
            "mexican lager beer",
            "dark beer",
            "beer"
        ],
        "bok choy": [
            "baby bok choy",
            "bok choy"
        ],
        "brandy": [
            "brandy"
        ],
        "bread": [
            "breadcrumbs"
        ],
        "broccoli": [
            "broccoli"
        ],
        "brussel sprout": [
            "brussel sprout"
        ],
        "brussels sprouts": [
            "brussels sprouts"
        ],
        "bun": [
            "brioche bun",
            "hotdog bun",
            "hamburger bun"
        ],
        "butter": [
            "unsalted butter",
            "salted butter",
            "melted butter",
            "butter"
        ],
        "cabbage": [
            "red cabbage",
            "cabbage"
        ],
        "campanelle": [
            "campanelle"
        ],
        "carrot": [
            "carrot"
        ],
        "cauliflower": [
            "cauliflower"
        ],
        "celery": [
            "celery"
        ],
        "cheese": [
            "parmesan cheese",
            "mozzarella cheese",
            "moterrey jack cheese",
            "mexican cheese blend",
            "oaxaca cheese",
            "nacho cheese"
        ],
        "cilantro": [
            "cilantro"
        ],
        "chicken": [
            "chicken wings",
            "chicken thigh",
            "chicken breast",
            "skinless chicken breast",
            "bonless skinless chicken breast",
            "whole chicken",
            "rotisserie chicken",
            "chicken broth",
            "chicken stock",
            "chicken"
        ],
        "chile": [
            "fresno chile",
            "serano chile",
            "green chile",
            "habanero chile",
            "chile"
        ],
        "chives": [
            "chives"
        ],
        "clam": [
            "clams in shell",
            "clam juice",
            "small clam",
            "clam"
        ],
        "coconut": [
            "coconut milk",
            "coconut oil",
            "coconut"
        ],
        "corn": [
            "frozen corn",
            "corn"
        ],
        "cornichon": [
            "cornichon"
        ],
        "coriander": [
            "fresh coriander",
            "dried coriander",
            "ground coriander",
            "coriander"
        ],
        "cucumber": [
            "cucumber"
        ],
        "cumin": [
            "ground cumin",
            "cumin"
        ],
        "cummin": [
            "ground cummin",
            "cummin"
        ],
        "dough": [
            "pizza dough"
        ],
        "drumstick": [
            "drumstick"
        ],
        "duck": [
            "duck fat",
            "duck"
        ],
        "egg": [
            "egg yolk",
            "egg whites",
            "egg"
        ],
        "eggplant": [
            "chinese eggplant",
            "asian eggplant",
            "eggplant"
        ],
        "fat": [
            "paleo cooking fat",
            "cooking fat",
            "fat"
        ],
        "fennel": [
            "fennel bulb",
            "fennel seeds"
        ],
        "fish": [
            "fish broth"
        ],
        "flour": [
            "all-purpose flour",
            "self rising flour",
            "bread flour",
            "bleached flour",
            "flour"
        ],
        "garlic": [
            "garlic powder",
            "garlic clove",
            "clove garlic",
            "garlic head",
            "garlic salt",
            "garlic"
        ],
        "ginger": [
            "fresh ginger",
            "ground ginger",
            "ginger tea",
            "ginger ale",
            "ginger"
        ],
        "grouper": [
            "grouper"
        ],
        "half and half": [
            "half and half"
        ],
        "half-and-half": [
            "half-and-half"
        ],
        "ham": [
            "deli ham",
            "ham"
        ],
        "heavy cream": [
            "heavy cream"
        ],
        "ice cream": [
            "vanilla ice cream",
            "ice cream"
        ],
        "kale": [
            "red kale",
            "kale"
        ],
        "ketchup": [
            "ketchup"
        ],
        "leaves": [
            "marjoram leaves",
            "bay leaves"
        ],
        "leek": [
            "leek"
        ],
        "lemon": [
            "lemon juice",
            "lemon"
        ],
        "lettuce": [
            "romaine lettuce",
            "little gem lettuce",
            "iceberg lettuce",
            "lettuce"
        ],
        "lime": [
            "lime juice",
            "lime"
        ],
        "linguine": [
            "linguine"
        ],
        "maple": [
            "pure maple syrup",
            "maple syrup"
        ],
        "marjoram": [
            "marjoram leaves",
            "marjoram"
        ],
        "melon": [
            "honeydew melon",
            "melon"
        ],
        "milk": [
            "whole milk",
            "goat milk",
            "almond milk",
            "almondmilk",
            "skim milk",
            "milk"
        ],
        "mint": [
            "mint leaves",
            "mint extract",
            "mint"
        ],
        "miso": [
            "yellow miso paste",
            "miso"
        ],
        "mozzarella": [
            "fresh mozzarella",
            "low moisture mozzarella",
            "low-moisture mozzarella",
            "mozzarella"
        ],
        "mushroom": [
            "white mushroom",
            "shitake mushroom",
            "mushroom"
        ],
        "mustard": [
            "yellow mustard",
            "dijon mustard",
            "spicy brown mustard",
            "english mustard",
            "mustard seed",
            "mustard"
        ],
        "oil": [
            "avocado oil",
            "coconut oil",
            "peanut oil",
            "sesame oil",
            "canola oil",
            "grapeseed oil",
            "vegetable oil",
            "cooking oil",
            "neutral oil",
            "walnut oil",
            "extra-virgin olive oil",
            "extra-virgin oil olive",
            "oil olive",
            "olive oil",
            "oil"
        ],
        "olive": [
            "picual olive",
            "black olive",
            "olive"
        ],
        "onion": [
            "red onion",
            "sweet onion",
            "green onion",
            "yellow onion",
            "onion"
        ],
        "oregano": [
            "fresh oregano",
            "dried oregano",
            "oregano"
        ],
        "paprika": [
            "spanish paprika",
            "smoked sweet paprika",
            "sweet paprika",
            "smoked paprika",
            "hungarian paprika",
            "paprika"
        ],
        "parmesan": [
            "grated parmesan",
            "parmesan"
        ],
        "parmigiano-reggiano": [
            "parmigiano-reggiano"
        ],
        "parsley": [
            "parsley flakes",
            "fresh parsley",
            "flat-leaf parseley",
            "italian parseley",
            "parsley leaves",
            "parsley"
        ],
        "pea": [
            "snow pea",
            "snap pea",
            "frozen pea",
            "fresh pea",
            "pea"
        ],
        "pepper": [
            "cayenne pepper",
            "red bell pepper",
            "green bell pepper",
            "yellow bell pepper",
            "red pepper flakes",
            "ground red pepper",
            "jalapeno pepper",
            "jalapeño pepper",
            "black pepper",
            "anaheim chile pepper",
            "ground pepper",
            "bell pepper",
            "pepper"
        ],
        "pork": [
            "ground pork",
            "bone-in pork loin",
            "pork tenderloin",
            "minced pork",
            "pork chop",
            "pork"
        ],
        "potato": [
            "yukon gold potato",
            "gold potato",
            "sweet potato",
            "red potato",
            "russet potato",
            "potato"
        ],
        "powder": [
            "curry powder",
            "onion powder",
            "baking powder",
            "chili powder",
            "powder"
        ],
        "puff pastry": [
            "puff pastry"
        ],
        "prosciutto": [
            "prosciutto"
        ],
        "queso": [
            "queso asadero",
            "ques"
        ],
        "radicchio": [
            "radicchio leaves",
            "radicchio"
        ],
        "rice": [
            "cooked rice",
            "white rice",
            "brown rice",
            "rice"
        ],
        "ricotta": [
            "fresh ricotta",
            "ricotta"
        ],
        "rosemary": [
            "fresh rosemary",
            "dried rosemary",
            "sprigs rosemary",
            "rosemary"
        ],
        "salmon": [
            "salmon cutlet",
            "salmon fillets",
            "grilled salmon",
            "salmon"
        ],
        "salt": [
            "kosher salt",
            "sea salt",
            "table salt",
            "garlic salt",
            "salt & pepper",
            "salt"
        ],
        "sauce": [
            "soy sauce",
            "hot sauce",
            "worcestershire sauce",
            "bbq sauce",
            "teriyaki sauce",
            "marinara sauce",
            "sauce"
        ],
        "sausage": [
            "andouille sausage",
            "italian sausage",
            "sweet italian sausage"
        ],
        "seasoning": [
            "old bay seasoning",
            "poultry seasoning",
            "pork seasoning",
            "seasoning blend",
            "italian seasoning",
            "cajun seasoning",
            "seasoning"
        ],
        "sesame": [
            "toasted sesame oil",
            "sesame seed",
            "sesame oil"
        ],
        "shallot": [
            "shallot"
        ],
        "shrimp": [
            "large shrimp",
            "jumbo shrimp",
            "shrimp"
        ],
        "soda": [
            "baking soda",
            "soda water",
            "club soda"
        ],
        "sour cream": [
            "sour cream"
        ],
        "spaghetti": [
            "spaghetti"
        ],
        "spinach": [
            "baby spinach",
            "spinach"
        ],
        "spray": [
            "cooking spray"
        ],
        "squash": [
            "buttercup squash",
            "butternut squash",
            "squash"
        ],
        "starch": [
            "corn starch",
            "rice starch",
            "cornstarch"
        ],
        "sugar": [
            "white sugar",
            "light brown sugar",
            "dark brown sugar",
            "brown sugar",
            "powder sugar",
            "raw sugar",
            "powdered sugar",
            "granulated sugar",
            "cane sugar",
            "sugar"
        ],
        "sun flower": [
            "sun flower seed",
            "sun flower oil"
        ],
        "thyme": [
            "fresh thyme",
            "dried thyme",
            "thyme"
        ],
        "tomato": [
            "cherry tomato",
            "grape tomato",
            "tomato paste",
            "tomato sauce",
            "tomato"
        ],
        "tortilla": [
            "corn tortilla",
            "flour tortilla",
            "tortilla"
        ],
        "tuna": [
            "tuna steaks",
            "tuna"
        ],
        "turnip": [
            "turnip"
        ],
        "vanilla": [
            "vanilla extract",
            "vanilla bean",
            "vanilla"
        ],
        "vegetable shortening": [
            "vegetable shortening"
        ],
        "vinegar": [
            "rice vinegar",
            "rice wine vinegar",
            "apple cider vinegar",
            "cider vinegar",
            "white vinegar",
            "vinegar"
        ],
        "walnuts": [
            "whole walnuts",
            "walnuts"
        ],
        "wasabi": [
            "wasabi paste",
            "wasabi root",
            "wasabi"
        ],
        "water": [
            "cold water",
            "hot water",
            "water"
        ],
        "wine": [
            "red wine",
            "dry white wine",
            "white wine",
            "wine"
        ],
        "yam": [
            "yam"
        ],
        "yogurt": [
            "greek yogurt",
            "plain yogurt",
            "vanilla yogurt",
            "yogurt"
        ],
        "zucchini": [
            "zucchini"
        ]
    }
}


const stringToScan = [
    "olive oil",
    "2 garlic cloves, finely grated",
    "2 Tbsp. plus 2 tsp. fresh lemon juice",
    "2 tsp. freshly ground black pepper, plus more",
    "⅓ cup plus 2 tsp. extra-virgin olive oil, plus more for grill",
    "¼ cup chopped cornichons (about 9)",
    "4 large or 6 small skinless, boneless chicken thighs",
    "1 small head Little Gem lettuce",
    '1 medium tomato, sliced ¼" thick',
    "something that doesnt exist",
    "making this a very long ingredient, for no good reason what so ever, maybe i hsouldjustjsdjf;klajsdfklj a;dsjf jfldasjfsdl lasdfjasdf"
]
//will test regex vs indexOf
function callRegex(){
    performance.mark('Beginning regex');
    var a = stringToScan.map(function (ingLine){
        return scanIngredsRegex(ingLine)
    })
    // console.log(a);
    performance.mark('Ending regex');
}
function scanIngredsRegex( ingLine ){
    var bestMatch = '';
    var ingredients = longList.ingredients;

    Object.keys(ingredients).forEach( function (ingredKey){
        var regex = new RegExp(ingredKey);

        if ( regex.test(ingLine) ){
            //means we have a match, lets look at the more closer ingredients
            ingredients[ingredKey].forEach(function (specificName){
                var specificRegex = new RegExp(specificName);
                if(specificName.length > bestMatch.length && specificRegex.test(ingLine)){
                    bestMatch = specificName
                }
            })
        }
    });
    if ( bestMatch.length !== ''){
        return bestMatch;
    }
    else {
        return 'no match';
    }
    
    //will return if a match, and the word matched
}

function callIndexOf(){
    performance.mark('Beginning indexof');
    var a = stringToScan.map(function (ingLine){
        return scanIngredsIndexOf(ingLine)
    })
    // console.log(a);
    performance.mark('Ending indexof');
}
function scanIngredsIndexOf(ingLine){
    var bestMatch = '';
    var ingredients =  longList.ingredients;

    Object.keys(ingredients).forEach( function (ingredKey){
        if ( ingLine.indexOf(ingredKey) > -1 ){
            //means we have a match, lets look at the more closer ingredients
            ingredients[ingredKey].forEach(function (specificName){
                if(specificName.length > bestMatch.length && ingLine.indexOf(specificName) > -1 ){
                    bestMatch = specificName
                }
            })
        }
    });

    if ( bestMatch.length !== ''){
        return bestMatch;
    }
    else {
        return 'no match';
    }
}

function callAll (){
    callRegex();
    callIndexOf();
    performance.measure('Regex Speed', 'Beginning regex', 'Ending regex');
    performance.measure('Indexof Speed', 'Beginning indexof', 'Ending indexof');
    const measurements = performance.getEntriesByType('measure');
        measurements.forEach(measurement => {
    // I'm going to make the logs colour-coded, in this case I'm using Green
        console.log('\x1b[32m%s\x1b[0m', measurement.name + ' ' + measurement.duration);
    })
    console.log('END')
}

callAll();

// const wrappedIndexOf = performance.timerify(callIndexOf);
// const wrappedRegex = performance.timerify(callRegex);

// const obs = new PerformanceObserver((list) => {
//     console.log(list.getEntries());
//     obs.disconnect();
// });

// obs.observe({ entryTypes: ['function'] });

// A performance timeline entry will be created
// wrappedIndexOf();
// wrappedRegex();
