const { auth } = require('../../data/models/token/index.js');
const Handler = require('../../logic/handler/index.js');

class Controller {
    static Router = () => {
        const router = require('express').Router();

        router.post('/signup', Handler.postSignup);
        router.post('/signin', Handler.postSignin);
        router.post('/signout', auth, Handler.postSignout);
        router.patch('/user', auth, Handler.putUser, Handler.postSignout);
        router.patch('/password', auth, Handler.putPassword, Handler.postSignout);

        return router;
    }
}

module.exports = Controller;