function copyInput() {
    var input = document.getElementById('calendarID');
    input.select();
    document.execCommand('copy');
}

function handleCalendarChange() {
    var optionValue = document.getElementById('sharingCalendar').value;
    console.log(optionValue);
    document.getElementById('calendarID').value = optionValue;
}