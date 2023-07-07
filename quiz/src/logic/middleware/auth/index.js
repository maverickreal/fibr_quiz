const axios = require('axios');

class Auth {
    static async authenticate(req, res, next) {
        const res = await axios.get(process.env.AUTHAPIURL + '/verify', {
            params: { token: req.query.token }
        });
        if (res.status === 200) {
            req.user = res.data;
            next();
        }
        res.status(401).send('Unauthorized');
    }
}

module.exports = Auth;