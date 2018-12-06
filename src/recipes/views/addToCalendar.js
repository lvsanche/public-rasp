function selectMeal(event) {
    //make sure all others have it 
    clearMealButtons()
    console.log('pressed')
    event.srcElement.classList.remove('btn-cancel');
    console.log(event.srcElement.textContent)
    document.getElementById('meal').value = event.srcElement.textContent.toLowerCase();
}

function clearMealButtons() {
    var allMealBtns = document.getElementsByClassName('meal');
    for(var i = 0; i < allMealBtns.length; i++){
        allMealBtns[i].classList.add('btn-cancel');
    }
}

var allMealBtns = document.getElementsByClassName('meal');
var allMealBtns = document.getElementsByClassName('meal');
for(var i = 0; i < allMealBtns.length; i++){
    allMealBtns[i].classList.add('btn-cancel');
    allMealBtns[i].addEventListener('click', selectMeal);
}