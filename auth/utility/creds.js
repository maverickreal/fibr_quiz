const emailPattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const phoneNumberPattern = /^(\+?\d{1,3}[- ]?)?\d{10}$/;

const checkPhoneNumber = phoneNumber => phoneNumberPattern.test(phoneNumber);

const checkEmail = email => emailPattern.test(email);

const checkAge = age => (age && !isNaN(age) && age>-1 && age<200);

const checkPassword = password => {
    if (password.length < 6) {
        return false;
    }
    let strength = 1;
    if (password.length >= 8){
        strength += 1;
    }
    if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)){
        strength += 2;
    }
    if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)){
        strength += 3;
    }
    if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)){
        strength += 3;
    }
    if (password.length > 12){
        strength += 1;
    }
    return ( strength>=3 );
}


module.exports = { checkEmail, checkPassword,
                   checkPhoneNumber, checkAge };