const Handler = require('../../logic/handlers/index.js'),
    Auth = require('../../logic/middleware/auth/index.js'),
    QuizMiddleware = require('../../logic/middleware/quiz/index.js');

class Controller {
    static router = () => {
        const router = require('express').Router();

        router.post('', Auth.authenticate, Handler.createQuiz);
        router.get('/question', Auth.authenticate, QuizMiddleware.quizMiddleware, Handler.getQuizQuestion);
        router.post('/answer', Auth.authenticate, QuizMiddleware.quizMiddleware, Handler.postQuizQuestionAnswer);
        router.get('/score', Auth.authenticate, QuizMiddleware.quizMiddleware, Handler.getQuizScore);

        return router;
    }
}

module.exports = Controller;