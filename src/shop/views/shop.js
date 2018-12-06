//add even listener to the divs stacked container

var containers = document.getElementsByClassName('stackedContainer');

for (var i =0; i < containers.length; i++){
    containers[i].addEventListener('click', (e) => openDetails(e) );
}

function openDetails (event){
    console.log(event.target);
    if( event.target.classList.contains('stackedContainer')){
        var containerID = event.target.id+'-breakdown';
        toggleVisibility(containerID);
    }
    else if (event.target.parentNode) {
        //traverse up until finding parent ID
        ;
        var target = event.target.parentNode;
        console.log(target)
        //lets go 5 level
        for ( var i = 0; i < 5; i++){
            if ( target.classList.contains('stackedContainer') ){
                var containerID = target.id +'-breakdown';
                toggleVisibility(containerID)
                break
            }
            else {
                target = target.parentNode;
                console.log(target)
            }
        }
    }
    console.log(event.target.parentNode)

}

function toggleVisibility (containerID ){
    console.log('toogled')
    var details = document.getElementById(containerID);
        if ( details.classList.contains('is-hidden')){
            details.classList.remove('is-hidden');
            details.classList.add('is-visible');
        }
        else {
            details.classList.add('is-hidden');
            details.classList.remove('is-visible');
        }
}