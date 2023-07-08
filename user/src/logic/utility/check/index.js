class Check {
    static password(password) {
        if (password.length < 6) {
            return false;
        }
        let strength = 1;
        if (password.length >= 8) {
            strength += 1;
        }
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
            strength += 2;
        }
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
            strength += 3;
        }
        if (password.match(/([!,%,&,@,#,$,^,*,?,_,~])/)) {
            strength += 3;
        }
        if (password.length > 12) {
            strength += 1;
        }
        return (strength >= 3);
    }
}

module.exports = Check;