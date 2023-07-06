const Handler = require('../../logic/handler/index.js');

class Controller {
    static router = () => {
        const router = require('express').Router();

        router.post('', Handler.signup);
        router.patch('', Handler.updateUser);
        router.get('', Handler.getUser);

        return this.router;
    }
}

module.exports = Controller;