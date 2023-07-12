const axios = require('axios').create({ validateStatus: false });
const container = require('../../utility/di/index.js');

const Constant = container.resolve('Constant');

class Auth {
    static async authenticate(req, res, next) {
        const token = req.query.token || req.body.token;
        const respAuth = await axios.get(process.env.AUTHAPIURL + Constant.authApiAuthenticatePath, {
            params: { token }
        });
        if (respAuth.status !== 200) {
            return res.status(401).send('Unauthorized');
        }
        const respUser = await axios.get(process.env.USERAPIURL, {
            params: { email: respAuth.data.user.email }
        });
        req.user = respUser.data.data;
        next();
    }
}

module.exports = Auth;