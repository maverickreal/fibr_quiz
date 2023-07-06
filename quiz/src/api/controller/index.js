const Handler = require('../../logic/handlers/index.js');

class Controller {
    static router = () => {
        const router = require('express').Router();

        router.post('', Handler.createQuiz);
        router.get('/question', Handler.getQuizQuestion);
        router.post('/answer', Handler.postQuizQuestionAnswer);

        return this.router;
    }
}

module.exports = Controller;