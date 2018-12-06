function handleNewCalendarSubmit (event) {
    var calendarInput = document.getElementById('calendar');
    if( calendarInput.value === ''){
        addErrors(true, 'Enter a name or ID')
        event.preventDefault();
        return false;
    }    

    return true;
}

function addErrors( clear, msg) {
    //will allow to add a message to the errors UL and or will clear it before adding to it
    if( clear ){
        document.getElementById('errors').innerHTML = '';
    }

    var newMsg = document.createElement('LI');
    newMsg.textContent = msg;
    document.getElementById('errors').appendChild(newMsg);
}

var formElement = document.getElementById('new-calendar');
formElement.addEventListener("submit", handleNewCalendarSubmit, false)