var months = [ {month:"Jan", days: 31},{month: "Feb",days: 28}, {month: "Mar", days: 31},
{month: "Apr", days: 30}, {month: "May", days: 31}, {month: "Jun", days: 30}, {month: "Jul", days: 31},
{month: "Aug", days: 31}, {month: "Sep", days: 30}, {month: "Oct", days: 31}, {month: "Nov", days: 30},
{month: "Dec", days: 31} ]; 

var daySelect = document.getElementById('day-select');
daySelect.addEventListener("change", event => {
    loadMeals(event.srcElement.value);
})

var optionArray = daySelect.children;
loadMeals(optionArray[0].value) //time to load sunday's meals

var sundayDate = standardizeDate(optionArray[0].value);
var day = sundayDate.getDate();
var monthIndex = sundayDate.getMonth();
var year = sundayDate.getFullYear();
// console.log(sundayDate);
console.log(monthIndex)
for( var i = 1; i < optionArray.length; i++){
    console.log(monthIndex);
    if( day+i <= months[monthIndex].days ){
        var nextDay = day+i
        optionArray[i].innerHTML+= nextDay;
        optionArray[i].value = year+'-'+(monthIndex+1)+'-'+nextDay; //give the proper month as it is offset by 1
    }
    else {
        var nextDay = (day+i)% months[monthIndex].days;
        optionArray[i].innerHTML+= nextDay;
        if( monthIndex === 11){
            optionArray[i].value = year+1+'-1-'+nextDay ;
        }
        else {
            optionArray[i].value = year+'-'+(monthIndex+2)+'-'+nextDay ;
        }
    }
}

function standardizeDate (date){
    if ( typeof date === 'string'){
        //means we need to break it up
        //format will be year, month, day, needs to be made clean sub a month
        var nums = date.split('-').map( str => parseInt(str));
        return new Date(nums[0], nums[1]-1, nums[2], 0, 0, 0, 0);
    }
    else {
        //means it is a date, we must strip the time just in case
        return new Date( date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0,0 );
    }
}

function goBack() {
    window.history.back();
}

function recipeIntoLI (recipe) {
    //could be an object or a string
    if ( typeof recipe === 'string'){
        return '<li class="removeItem"><label class="fullWidth">'+recipe+'</label><button class="removeBtn" type="button"><i class="fas fa-times-circle"></i></button></li>'
    }
    else {
        return '<li class="removeItem"><a class="fullWidth" href="/recipes/'+recipe._id.toString()+'">'+recipe.name+'</a><button class="removeBtn"><i class="fas fa-times-circle"></i></button></li>'
    }
}

function loadMeals(date){ //TODO update to call list code
    var xhttp = new XMLHttpRequest();
    var urlSplit = window.location.href.split('/');
    var calendarID = urlSplit[urlSplit.length-2];    
    xhttp.open("POST", "/calendar/fetchDate", true);

    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
        //    console.log(xhttp.responseText);
            var mealSections = JSON.parse(xhttp.responseText);
            console.log(mealSections);
            if(Object.keys(mealSections).length >0){
                Object.keys(mealSections).forEach(function(meal){
                    //must go through the list and make the li string
                    var html = "";
                    mealSections[meal].forEach(function(recipe){
                        if( recipe ){ //skip null 
                            html+= recipeIntoLI(recipe);
                        }
                    })
            
                    document.getElementById(meal+'-list').innerHTML = html; //need to modify the list 
                })
                addListenerRemove();
            }
        }
    };
    console.log(date);
    xhttp.send("calendarID="+calendarID+"&date="+date);
}


//get all add buttons and add listener 
var addBtns = document.getElementsByClassName('addRecipe');

for( var i = 0; i < addBtns.length; i++){
    addBtns[i].addEventListener('click', addMealText)
}

function addMealText(event){ // will be used for listener
    //get all buttons with class addRecipe 0 - breakfast 1 - lunch dinner then snack
    //figure out which relative input it is
    
    var inputElem = event.srcElement.parentNode.firstChild;
    
    var section = inputElem.id.split('-')[0];
    //add text into the ul with the correct name
    var sectionList = document.getElementById(section+'-list');

    var newListItem = document.createElement("li");
    newListItem.classList.add('removeItem');
    newListItem.innerHTML = '<label class="fullWidth">'+inputElem.value+'</label><button class="removeBtn" type="button"><i class="fas fa-times-circle"></i></button>';
    sectionList.appendChild(newListItem);

    inputElem.value = '';
    sectionList.lastChild.lastChild.addEventListener('click', removeMealText);
}

//first add the event listener to all inputs
function addListenerRemove() {
    
    var removeBtns = document.getElementsByClassName('removeBtn');
    for( var i = 0; i < removeBtns.length; i++){
        removeBtns[i].addEventListener('click', removeMealText)
    }
}
addListenerRemove();

function removeMealText(event){
    var listElement = event.srcElement.parentNode.parentNode;
    listElement.remove();
}

//handling the new 
function handleNewMeals(){
    //will need to take all the list items and add to the hidden inputs
    var meals = ['breakfast', 'lunch', 'dinner', 'snacks'];
    
    meals.forEach(function(meal){
        //get hidden input
        var input = document.getElementById(meal+'-input');
        //transform list items
        var listItems = document.getElementById(meal+'-list').children;
        //must check for the elements that have an anchor child
        var inputStr = "";
        for(var i=0; i < listItems.length; i++){
            if ( listItems[i].firstElementChild.nodeName === 'A'){
                //means we have a value with id that needs to be preserved
                var urlArray = listItems[i].firstElementChild.href.split('/');
                inputStr+= '//'+ urlArray[urlArray.length-1]
                
            }
            else if (listItems[i].firstElementChild.nodeName === 'LABEL') {
                var label = listItems[i].firstElementChild;
                inputStr+= '//'+label.textContent.trim(); //adding a delimiter
            }
            
        }
        console.log(inputStr);
        input.value = inputStr;
    })
    return true;
}