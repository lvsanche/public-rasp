//getting the date in place
const months = [ {month:"Jan", days: 31},{month: "Feb",days: 28}, {month: "Mar", days: 31},
{month: "Apr", days: 30}, {month: "May", days: 31}, {month: "Jun", days: 30}, {month: "Jul", days: 31},
{month: "Aug", days: 31}, {month: "Sep", days: 30}, {month: "Oct", days: 31}, {month: "Nov", days: 30},
{month: "Dec", days: 31} ]; 

//function will change the elements to work with the current sunday date
function ChangeWeekDates({monthIndex, day, year}){
    //given the sunday values
    
    var elemArray = document.getElementsByClassName('stackedContainer');
    for( let i = 0; i < elemArray.length; i++){
        elemArray[i].children[0].innerHTML = (day+i <= months[monthIndex].days) ? day+i : (day+i) % months[monthIndex].days;
    }
    // console.log('Changing dates');
    document.getElementById('week-of').innerHTML = 'Week of: <br/> <strong>'+ months[monthIndex].month+' '+ day +'</strong>';
    
    var currentDate = year+'-'+(monthIndex+1)+'-'+day;
    var chrefArray = document.getElementById('new-meal-btn').href.split('/');
    var shopHrefArray = document.getElementById('go-shop').href.split('/');
    if( chrefArray.length === 7){
        chrefArray[6] = currentDate;
        shopHrefArray[5] = currentDate;
        document.getElementById('new-meal-btn').href = chrefArray.join('/');
        document.getElementById('go-shop').href = shopHrefArray.join('/');
    }
    else{
        document.getElementById('new-meal-btn').href+= '/'+currentDate;
        document.getElementById('go-shop').href+= '/'+currentDate;
    }
    loadMeals(currentDate);
        
};

//takes true or false, if true, sundayDate is changed ahead one week else it is one week back
function changeWeek( ahead ){
    //get current date from the sunday tile
    var href = document.getElementById('new-meal-btn').href.split('/');
    var date = new Date(href[href.length-1]+ " 00:00:00");
    // console.log(date);
    var monthIndex = date.getMonth();
    var year = date.getFullYear();
    var day = date.getDate();
    // console.log(monthIndex)
    // console.log(day)
    if (ahead){
        //means we are going 1 week ahead
        if( day + 7 <= months[monthIndex].days){
            day = day+7;
            
        }
        else{
            //must check for year ahead
            day = (day+7) % months[monthIndex].days
            monthIndex = (monthIndex+1);
            if(monthIndex >= months.length){
                monthIndex = monthIndex % months.length;
                //must also increment year
                year+=1;
            }
        }
    }
    else{
        if( day - 7 < 1 ){
            monthIndex-=1;
            if ( monthIndex < 0){
                monthIndex = 11; //change to december going backwards
                year-=1;
            }

            day = day-7+months[monthIndex].days;
        }
        else{
            day-=7;
        }
    }

    ChangeWeekDates({monthIndex: monthIndex, day: day, year: year });
}


function loadMeals(sundayDate){
    var xhttp = new XMLHttpRequest();
    var urlSplit = window.location.href.split('/');
    var calendarID = urlSplit[urlSplit.length-1];
    xhttp.open("POST", "/calendar/fetchDates", true);


    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //    console.log(xhttp.responseText);
            var dates = JSON.parse(xhttp.responseText);
            // console.log(dates);

            //time to make some elements
            var weekDiv = document.getElementById('current-week');
            //clear all the divs
            var mealsArray = document.getElementsByClassName('meals');
            for( var i = 0; i < mealsArray.length; i++){
                mealsArray[i].innerHTML = '';
            }

            for( var i = 0; i < dates.length; i++){
                var strDate = dates[i].date.split('-')[2].substr(0,2);
                for ( var j = 0; j < weekDiv.children.length; j++){
                    var compDate = weekDiv.children[j].children[0].innerText;
                    if ( parseInt(compDate) === parseInt(strDate)){
                        //now make the dom
                        console.log(dates[i]);
                        //remove anything that is there
                        var mealOrder = [ "breakfast", "lunch", "dinner", "snacks"]
                        mealOrder.forEach( key => {
                            
                            if( dates[i].meals[key].length >= 1){
                                var x = document.createElement("label");
                                x.classList.add('small');
    
                                var t = document.createTextNode(key[0].toUpperCase()+key.substr(1, key.length)+":")
                                x.appendChild(t);
    
                                mealsArray[j].appendChild(x); 
    
                                //now we add the ul and items
                                var ul = document.createElement("ul");
                                ul.classList.add('spaced-list')
                                console.log(dates[i].meals)
                                var mealArray = dates[i].meals[key];
                                for(var k=0; k < mealArray.length; k++){
                                    //now we create 
                                    // console.log('creating')
                                    
                                    var meal = mealArray[k];
                                    if ( meal ){
                                        var li = document.createElement("li");
                                        li.classList.add('innerLeft')
                                        if(typeof meal === 'string'){
                                            //just append one text node
                                            li.appendChild(document.createTextNode(meal))
                                        }
                                        else if ( meal.name && meal._id) {
                                            var aEl = document.createElement("a");
                                            aEl.href = '/recipes/'+meal._id;
                                            aEl.textContent = meal.name;
                                            li.appendChild(aEl);
                                        }
                                        
                                        ul.appendChild(li);
                                    }
                                    
                                }
                                mealsArray[j].appendChild(ul)
                            }
                        });
                            
                        break;
                    }
                }
            }
        }
    };

    
    xhttp.send("calendarID="+calendarID+"&sundayDate="+sundayDate);
}

//Happens automatically on the load !
var date = new Date();
//get array of date labels and on each get the correct date entered
var curDayOfWeek = date.getDay();
var curDate = date.getDate();
var possibleDate = curDate - curDayOfWeek;

const sundayDate = (possibleDate) > 0 
    ? {monthIndex: date.getMonth(), day: possibleDate, year: date.getFullYear()}
    : {monthIndex: date.getMonth() - 1, day: possibleDate+months[date.getMonth()-1].days, year: date.getFullYear()};
ChangeWeekDates(sundayDate);
/*adding the ability to call the week ahead or week back*/
document.getElementById('week-back').addEventListener("click", () => changeWeek(false) );
document.getElementById('week-forward').addEventListener("click", () => changeWeek(true) );
