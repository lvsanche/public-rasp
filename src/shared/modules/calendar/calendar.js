var months = [ {month:"January", days: 31},{month: "February",days: 28}, {month: "March", days: 31},
{month: "April", days: 30}, {month: "May", days: 31}, {month: "June", days: 30}, {month: "July", days: 31},
{month: "August", days: 31}, {month: "September", days: 30}, {month: "October", days: 31}, {month: "November", days: 30},
{month: "December", days: 31} ]; 

var date = new Date();
var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
updateCalendar(firstDay);

var dateButtons = document.getElementsByClassName("calendarDate");
for(var i = 0; i < dateButtons.length; i++){
    dateButtons[i].addEventListener('click', selectDate)
    if( !dateButtons[i].disabled && dateButtons[i].textContent === date.getDate().toString() ){
        //press the button
        dateButtons[i].click();
    }
}

function updateCalendar ( firstDay ) {
    clearDateButtons();
    document.getElementById('month').textContent = months[firstDay.getMonth()].month;
    //now update all the dates
    var dateButtons = document.getElementsByClassName("calendarDate");
    var currentMonth = document.getElementById('currentMonth');

    currentMonth.value = firstDay.getFullYear()+'-'+(firstDay.getMonth()+1)+'-1';

    var startIndex = firstDay.getDay();
    var lastIndex = months[firstDay.getMonth()].days + startIndex;
    for(var i = 0, j=1, k=1; i < dateButtons.length ; i++ ){
        if( i < startIndex){
            dateButtons[i].disabled = true;
            dateButtons[i].textContent = ' ';
            //must account for last year
            var prevMonth = (firstDay.getMonth() === 0) ? 11 : firstDay.getMonth()-1
            //console.log(prevMonth);
            dateButtons[i].textContent = months[prevMonth].days - startIndex + i + 1;
        }
        else if (i >= lastIndex){
            dateButtons[i].disabled = true;
            dateButtons[i].textContent = k;
            k++;
        }
        else {
            dateButtons[i].disabled = false;
            dateButtons[i].textContent = j;
            j++;
        }
    }
}

function changeMonth(month) {
    //get current monthvalue 
    var currentMonth = document.getElementById('currentMonth');
    var arrayedDate = currentMonth.value.split('-');
    //reset date to 1st
    arrayedDate[2] = 1;
    var newMonth = (parseInt(arrayedDate[1]) + month); //must account for moving from future year to the past

    if ( newMonth === 13 ){
        //means we go one month ahead and change year
        arrayedDate[0] = (parseInt(arrayedDate[0]) + 1);
        arrayedDate[1] = 1;
    }
    else if ( newMonth === 0){
        arrayedDate[0] = (parseInt(arrayedDate[0]) - 1);
        arrayedDate[1] = 12; 
    }
    else {
        arrayedDate[1] = newMonth;
    }

    //console.log(arrayedDate)
    updateCalendar(new Date(arrayedDate.join('-')))
}

function clearDateButtons () {
    var dateButtons = document.getElementsByClassName("calendarDate");
    for(var i = 0; i < dateButtons.length; i++){
        dateButtons[i].classList.remove("pressedBtn")
    }
}

//how to remove 
function selectDate(event) {
    var btn = event.srcElement;
    
    //remove all other 
    var currentMonth = document.getElementById('currentMonth');
    var currentValue = currentMonth.value.split('-');
    currentValue[2] = btn.textContent;
    // console.log(currentValue)
    currentMonth.value = currentValue.join('-');
    clearDateButtons();
    btn.classList.add("pressedBtn");
}

function handleCalendarSubmit ( event ){
    //get the elements
    //erase prev errors
    document.getElementById('errors').innerHTML = '';
    var errors = [];
    var pressedCalendarBtn = document.getElementsByClassName('pressedBtn');
    if( pressedCalendarBtn.length != 1 ){
        //add warning about calendar button
        errors.push('Enter calendar date')
    }

    var mealType = document.getElementById('meal');
    if(!mealType.value ){
        console.log('No Value')
        errors.push('Enter meal')
    }

    if ( errors.length > 0){
        //display errors and return false
        errors.forEach( function (errorText){
            var el = document.createElement('LI');
            el.textContent = errorText;
            document.getElementById('errors').appendChild(el);
        })
        event.preventDefault();
        scroll(0,0);
        return false;
    }
    else{
        return true;
    }
}

var formElement = document.getElementById('add-to-calendar');
formElement.addEventListener("submit", handleCalendarSubmit, false);