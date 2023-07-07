const User = require('../../data/models/user/index.js');

class Handler {
    static #errorAndLog = (err, res) => {
        console.log(err);
        res.status(500).send();
    }
    static async signup(req, res) {
        try {
            const alreadyExistingUser = await User.findOne({ email: req.body.email });
            if (alreadyExistingUser) {
                return res.status(400).send({ message: 'User already exists.' });
            }
            const user = new User(req.body);
            await user.save();
            res.status(200).send({ message: 'User created.' });
        } catch (err) {
            Handler.#errorAndLog(err, res)
        }
    }
    static async getUser(req, res) {
        try {
            const user = await User.findOne({ email: req.query.email });
            res.status(200).send({ data: user });
        } catch (err) {
            Handler.#errorAndLog(err, res)
        }
    }
    static async updateUser(req, res) {
        try {
            await User.updateOne({ email }, req.body);
            res.status(200).send({ message: 'User updated.' });
        } catch (err) {
            Handler.#errorAndLog(err, res)
        }
    }
}

module.exports = Handler;