function menuPress() {
    //first clear all is-visible
    var navbarList = document.getElementById('navbar-list');
    if(navbarList)
        navbarList.className = 'is-hidden';

    var navList = document.getElementById('nav-list');
    navList.className = (navList.className === 'is-hidden') ? 'is-visible': 'is-hidden'; 
    let menuItem = document.getElementById("nav-menu").children[0];
    menuItem.className = (menuItem.className === "fas fa-bars") ? "fas fa-times" : "fas fa-bars";
};

function centerPress() {
    document.getElementById('nav-list').className = "is-hidden";
    document.getElementById("nav-menu").children[0].className = "fas fa-bars";
    var navbarList = document.getElementById('navbar-list');
    navbarList.className = (navbarList.className === 'is-hidden') ? 'is-visible': 'is-hidden'; 
};

function addErrors( clear, msg) {
    //will allow to add a message to the errors UL and or will clear it before adding to it
    if( clear ){
        document.getElementById('errors').innerHTML = '';
    }

    var newMsg = document.createElement('LI');
    newMsg.textContent = msg;
    document.getElementById('errors').appendChild(newMsg);
}

function goBack() {
    window.history.back();
}
