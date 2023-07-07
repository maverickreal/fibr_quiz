const Auth = require('../middleware/auth/index.js');

class Handler {
    static #errorAndLog(res, error) {
        console.log(error);
        res.status(500).send();
    }
    static async authorise(req, res) {
        try {
            const { user } = req.body;
            if (!user) {
                return res.status(404).send({ message: 'Correct user object not provided.' });
            }
            Auth.assignToken(user);
            res.status(200).send({ token: user.token });
        }
        catch (error) {
            Handler.#errorAndLog(res, error);
        }
    }

    static async unauthorise(req, res) {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(404).send({ message: 'Correct user not provided.' });
            }
            Auth.invalidate(userId);
            res.status(200).send();
        }
        catch (error) {
            Handler.#errorAndLog(res, error);
        }
    }

    static async verify(req, res) {
        try {
            const { token } = req.query,
                user = Auth.auth(token);

            console.log('xyz', token, user);
            if (user == null) {
                res.status(404).send({ message: 'Correct token not provided.' });
            }
            else {
                res.status(200).send({ user });
            }
        }
        catch (error) {
            Handler.#errorAndLog(res, error);
        }
    }
}
module.exports = Handler;