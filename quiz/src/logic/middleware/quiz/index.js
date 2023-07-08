const Quiz = require('../../../data/models/quiz/index.js');

class QuizMiddleware {
    static async quizMiddleware(req, res, next) {
        const quiz = await Quiz.findOne({ title: req.query.title });
        if (!quiz) {
            return res.status(404).send({ message: 'Quiz not found' });
        }
        req.quiz = quiz;
        next();
    }
}

module.exports = QuizMiddleware;