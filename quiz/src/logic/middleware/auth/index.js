const axios = require('axios').create({ validateStatus: false });

class Auth {
    static async authenticate(req, res, next) {
        const resp = await axios.get(process.env.AUTHAPIURL + '/verify', {
            params: { token: req.query.token }
        });
        if (resp.status === 200) {
            req.user = resp.data;
            next();
        }
        res.status(401).send('Unauthorized');
    }
}

module.exports = Auth;