function handleSubmit(event) {
    //must check that the input email and the password are entered
    var email = document.getElementById('email');
    var password = document.getElementById('password');
    document.getElementById('errors').innerHTML = '';
    if( email.value === ''){
        var msg = document.createElement('LI');
        msg.textContent = 'Enter email';
        document.getElementById('errors').appendChild(msg);
        event.preventDefault();
        console.log('something')
        return false;
    }
    
    if ( password.value === ''){
        var msg = document.createElement('LI');
        msg.textContent = 'Enter password';
        document.getElementById('errors').appendChild(msg);
        event.preventDefault();
        return false;
    }
    return true;
};

var formElement = document.getElementById('sign-in-form');
formElement.addEventListener("submit", handleSubmit, false)