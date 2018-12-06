var https = require('https');
var cheerio = require('cheerio');

var vals = {
    name: '.top-anchor',
    steps: 'span[class="step"]',
    ingredients: 'div[class="ingredients__text"]',
    servings: 'div.recipe__header__servings',
};

//https://www.bonappetit.com/recipe/caramelized-banana-pudding
var opt = {
    host: 'www.bonappetit.com',
    path: '/recipe/yogurt-marinated-grilled-chicken',
    header: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
    }
}


var sizes = [ 'lb. ', 'large ', 'Tbsp. ', 'cups ', 'cup ', 'small ', 'medium ', 'tsp. ', 'ripe ', 'bunch ' ];

//servings recipe__header__servings recipe__header__servings--basically first child span
//name post__header__hed first child or top-anchor
//step > div > p
https.get(opt, function(res){
    var str = [];
    res.on('data', function ( chunk){
        str.push(chunk.toString());
    });
    
    res.on('end', function (){
        // console.log(str[0]);
        str = str.join(' ');
        var bod = cheerio.load(str);
        // console.log('\n Name');
        // console.log(bod('.top-anchor')[0].children[0].data);

        //now we go through each
        console.log('\n Ingredients')
        bod('div[class="ingredients__text"]').each(function(i, elem){
            var text = bod(this).text();
            console.log(text);
            sizes.forEach( size => {
                var inde = text.indexOf(size);
                if( inde >= 0){
                    text = text.substr(inde+size.length);
                }
                inde = text.indexOf(',');
                if( inde >= 0){
                    text = text.substring(0,inde);
                }
                inde = text.indexOf('(');
                if( inde >= 0){
                    text = text.substring(0,inde);
                }
                text = text.replace(/^\d+\s*/, '');
            })

            console.log(text);
        })
        // console.log('\n Servings')
        // console.log(bod('.recipe__header__servings span')[0].children[0].data);

        // console.log('\n Steps')
        // // bod('li[class="step"]').each(function(i, elem){
        // //     var text = bod(this).
        // //     console.log(text);
        // // })
        // // var ingre = [0].children[0].children[0]; //p element
        // bod('li[class="step"] div p').each(function(i, elem){
        //     var elm = bod(this);
        //     //.children[0];
        //     // console.log(elem)
        //     var arr = elem.children;
        //     var step = ''
        //     arr.forEach(child => {
        //         if( child.type === 'text'){
        //             step+= child.data
        //         }
        //         else if ( child.name === 'strong'){
        //             //ned to look at children
        //             step+= child.children[0].data;
        //         }
        //     });
        //     console.log((i+1)+ '. '+step)
        // })
       

    })
});
