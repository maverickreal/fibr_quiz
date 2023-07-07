const { verify, sign } = require('jsonwebtoken');

class Auth {
    static #uidToJwt = {};

    static assignToken(user) {
        const jwtToken = sign(user,
            process.env.JWTSECRETKEY,
            { expiresIn: '7d' }
        );
        user.token = jwtToken;
        Auth.#uidToJwt[user.userId] = jwtToken;
    }

    static invalidate(userId) {
        delete Auth.#uidToJwt[userId];
    }

    static auth(jwtToken) {
        const user = verify(jwtToken, process.env.JWTSECRETKEY),
            realToken = Auth.#uidToJwt[user.userId];
        return (realToken === jwtToken ? user : null);
    };
}

module.exports = Auth;