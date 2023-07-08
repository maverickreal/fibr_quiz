const axios = require('axios').create({ validateStatus: false }),
    Constant = require('../../utility/constant/index.js'),
    User = require('../../../data/models/user/index.js');

class Auth {
    static async authenticate(req, res, next) {
        if (process.env.ENV === 'test') {
            req.user = await User.findOne({ email: req.query.email });
            return next();
        }
        const resp = await axios.get(process.env.AUTHAPIURL + Constant.authApiAuthenticatePath, {
            params: { token: req.query.token }
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
        const user = { email: req.user.email },
            resp = await axios.post(process.env.AUTAPIURL + Constant.authApiAuthorisePath, user),
            token = resp.data.token;
        if (token) {
            return res.status(200).send({ token, message: 'User created.' });
        }
        return res.status(500).send();
    }
    static async unauthorise(req, res) {
        const user = { email: req.user.email };
        const resp = await axios.delete('process.env.AUTAPIURL' + Constant.authApiUnauthorisePath, user);
        if (resp.status === 200) {
            return res.status(200).send();
        }
        return res.status(500).send();

    }
}

module.exports = Auth;