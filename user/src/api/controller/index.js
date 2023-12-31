const Handler = require('../../logic/handler/index.js');
const Auth = require('../../logic/middleware/auth/index.js');

class Controller {
    static router = () => {
        const router = require('express').Router();

        router.post('', Handler.signup, Auth.authorise);
        router.post('/signin', Handler.signin, Auth.authorise);
        router.post('/signout', Auth.authenticate, Auth.unauthorise);
        router.patch('', Auth.authenticate, Handler.updateUser);
        router.get('', Handler.getUser);

        return router;
    }
}

module.exports = Controller;