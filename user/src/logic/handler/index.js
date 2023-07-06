const User = require('../../data/models/user/index.js');

class Handler {
    static #errorAndLog = (err, res) => {
        console.log(err);
        res.status(500).send();
    }
    static signup = async (req, res) => {
        try {
            const user = new User(req.body);
            await user.save();
            res.status(201).send({ message: 'User created.' });

        } catch (err) {
            Handler.#errorAndLog(err, res)
        }
    }
    static getUser = async (req, res) => {
        try {
            const user = await User.findOne({ email });
            res.status(200).send({ data: user });

        } catch (err) {
            Handler.#errorAndLog(err, res)
        }
    }
    static updateUser = async (req, res) => {
        try {
            await User.updateOne({ email }, req.body);
            res.status(200).send({ message: 'User updated.' });
        } catch (err) {
            Handler.#errorAndLog(err, res)
        }
    }
}

module.exports = Handler;