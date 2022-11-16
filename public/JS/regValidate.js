const form = document.getElementById('form');
const username = document.getElementById('username');
const email = document.getElementById('email');
const mobile = document.getElementById('mobile');

const password = document.getElementById('password');
const password2 = document.getElementById('password2');

var prevu
var preve
var prevm

var prevp
var prevpp
form.addEventListener('submit', e => {
    
    validateInputs();
    if (prevu === 0 ||preve === 0 ||prevm === 0||prevp === 0 ||prevpp ===0) {
        e.preventDefault();
    }

});

const setError = (element, message) => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = message;
    inputControl.classList.add('error');
    inputControl.classList.remove('success')
}

const setSuccess = element => {
    const inputControl = element.parentElement;
    const errorDisplay = inputControl.querySelector('.error');

    errorDisplay.innerText = '';
    inputControl.classList.add('success');
    inputControl.classList.remove('error');
};

const isValidEmail = email => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

const validateInputs = () => {
    const usernameValue = username.value.trim();
    const emailValue = email.value.trim();
    const mobileValue = mobile.value.trim();
    
    const passwordValue = password.value.trim();
    const password2Value = password2.value.trim();

    if(usernameValue === '') {
        setError(username, 'Username is required');
        prevu = 0;
    } else {
        setSuccess(username);
        prevu = 1
    }

    if(emailValue === '') {
        setError(email, 'Email is required');
        preve = 0;
    } else if (!isValidEmail(emailValue)) {
        setError(email, 'Provide a valid email address');
        preve = 0;
    } else {
        setSuccess(email);
        preve = 1
    }
    //start  fghjhkjhkj
    if(mobileValue === '') {
        setError(mobile, 'Mobile is required');
        prevm = 0;
    } else {
        setSuccess(mobile);
        prevm = 1
    }

    
    //end  jhhkjlh
    if(passwordValue === '') {
        setError(password, 'Password is required');
        prevp = 0;
    } else if (passwordValue.length < 6 ) {
        setError(password, 'Password must be at least 6 character.')
        prevp = 0;
    } else {
        setSuccess(password);
        prevp = 1
    }

    if(password2Value === '') {
        setError(password2, 'Please confirm your password');
        prevpp = 0;
    } else if (password2Value !== passwordValue) {
        setError(password2, "Passwords doesn't match");
        prevpp = 0;
    } else {
        setSuccess(password2);
        prevpp = 1
    }

};