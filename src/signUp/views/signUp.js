function handleSignUpSubmit (event) {
    document.getElementById('errors').innerHTML = '';
    var newUser = {}
    newUser['fname'] = document.getElementById("fname").value;
    newUser['lname'] = document.getElementById("lname").value;
    newUser['email'] = document.getElementById("email").value;
    newUser['password'] = document.getElementById("password").value;
    newUser['confirmPW'] = document.getElementById("confirmPW").value;

    var cardHeader = document.getElementById('card-header');

    Object.keys(newUser).forEach( (key, index) =>
        {
            if ( newUser[key] === ''){
                var msg = document.createElement('LI');
                msg.textContent = 'Missing field: #'+(index+1);
                document.getElementById('errors').appendChild(msg);
                scroll(0,0);
                return false;
            }
        }
    );

    if( cardHeader.innerText === 'Sign Up!'  && (!newUser['email'].includes('@') ||
        !newUser['email'].includes('.') ||
        newUser['email'].includes(' '))
    ){
        var msg = document.createElement('LI');
        msg.textContent = 'Invalid Email';
        document.getElementById('errors').appendChild(msg);
        event.preventDefault();
        scroll(0,0);
        return false;
    }

    //check if pws match
    if ( newUser['password'] !== newUser['confirmPW']){
        var msg = document.createElement('LI');
        msg.textContent = 'Passwords do not match';
        document.getElementById('errors').appendChild(msg);
        event.preventDefault();
        scroll(0,0);
        return false;
    }

    if( newUser['password'].length < 6){
        var msg = document.createElement('LI');
        msg.textContent = 'Password is too short';
        document.getElementById('errors').appendChild(msg);
        event.preventDefault();
        scroll(0,0);
        return false;
    }

    return true;
}

var formElement = document.getElementById('sign-up-form');
formElement.addEventListener("submit", handleSignUpSubmit, false)