const axios = require('axios').create({ validateStatus: false }),
    Constant = require('../../utility/constant/index.js'),
    User = require('../../../data/models/user/index.js'),
    Crypt = require('../../utility/crypt/index.js');

class Auth {
    static async authenticate(req, res, next) {
        if (process.env.ENV === 'test') {
            req.user = await User.findOne({ email: req.query.email });
            return next();
        }
        const token = req.query.token || req.body.token;
        const resp = await axios.get(process.env.AUTHAPIURL + Constant.authApiAuthenticatePath, {
            params: { token }
        });
        if (resp.status !== 200) {
            return res.status(401).send('Unauthorized');
        }
        req.user = await User.findOne({ email: resp.data.user.email });
        next();
    }
    static async authorise(req, res) {
        if (process.env.ENV === 'test') {
            return res.status(200).send({ token: 'testToken', message: 'User created.' });
        }
        const body = { user: { email: req.user.email } };
        const resp = await axios.post(process.env.AUTHAPIURL + Constant.authApiAuthorisePath, body);
        if (resp.status === 200) {
            return res.status(200).send({ token: resp.data.token, message: 'User authorised.' });
        }
        return res.status(500).send();
    }
    static async unauthorise(req, res) {
        const body = { user: { email: req.user.email } };
        const resp = await axios.delete(process.env.AUTHAPIURL + Constant.authApiUnauthorisePath, { data: body });
        if (resp.status === 200) {
            return res.status(200).send();
        }
        return res.status(500).send();
    }
}

module.exports = Auth;