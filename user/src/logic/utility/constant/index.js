class Constant {
    constructor(){}
    static hashRounds = 10;
    static updateAllowedFields = ["firstName", "lastName"];
    static authApiAuthenticatePath = "/authenticate";
    static authApiAuthorisePath = "/authorise";
    static authApiUnauthorisePath = "/unauthorise";
}

module.exports = Constant;