const User = require('../../data/models/user/index.js'),
    Check = require('../../logic/utility/check/index.js'),
    Hash = require('../../logic/utility/hash/index.js'),
    Constant = require('../utility/constant/index.js'),
    Crypt = require('../../logic/utility/crypt/index.js');

class Handler {
    static #errorAndLog = (err, res) => {
        console.log(err);
        res.status(500).send();
    }
    static async signup(req, res, next) {
        try {
            const alreadyExistingUser = await User.findOne({ email: Crypt.encrypt(req.body.email) });
            if (alreadyExistingUser) {
                return res.status(400).send({ message: 'User already exists.' });
            }
            if (!Check.password(req.body.password)) {
                return res.status(400).send({ message: 'Password is not strong enough.' });
            }
            req.body.password = await Hash.hash(req.body.password);
            const user = new User(req.body);
            await user.save();
            req.user = user;
            next();
        } catch (err) {
            Handler.#errorAndLog(err, res)
        }
    }
    static async signin(req, res, next) {
        try {
            const user = await User.findOne({ email: Crypt.encrypt(req.body.email) });
            if (!user) {
                return res.status(400).send({ message: 'User does not exist.' });
            }
            if (!Hash.check(req.body.password, user.password.salt, user.password.hash)) {
                return res.status(400).send({ message: 'Password is incorrect.' });
            }
            req.user = user;
            next();
        } catch (err) {
            Handler.#errorAndLog(err, res)
        }
    }
    static async getUser(req, res) {
        try {
            const user = await User.findOne({ email: req.query.email }, { password: 0 });
            res.status(200).send({ data: user });
        } catch (err) {
            Handler.#errorAndLog(err, res)
        }
    }
    static async updateUser(req, res) {
        try {
            const updates = {};
            for (const item in Constant.updateAllowedFields) {
                if (req.body[item]) {
                    updates[item] = req.body[item];
                }
            }
            await User.updateOne({ email: req.user.email }, updates);
            res.status(200).send({ message: 'User updated.' });
        } catch (err) {
            Handler.#errorAndLog(err, res)
        }
    }
}

module.exports = Handler;