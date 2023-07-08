const Question = require('../../data/models/question/index.js');
const Quiz = require('../../data/models/quiz/index.js');

class Handler {
    static #errorAndLog(err, res) {
        console.log(err);
        res.status(500).send();
    }
    static async createQuiz(req, res) {
        try {
            const quiz = await Quiz.create({
                creator: req.user._id,
                title: req.body.title
            });
            let questions = req.body.questions;
            for (let ind = 0; ind < questions.length; ++ind) {
                questions[ind].sequenceNumber = ind;
                questions[ind].quiz = quiz._id;
            }
            questions = await Question.insertMany(req.body.questions);
            questions = questions.map(q => q._id);
            quiz.questions = questions;
            await quiz.save();
            res.status(201).send({ message: 'Quiz created' });
        } catch (err) {
            Handler.#errorAndLog(err, res);
        }
    }
    static async getQuizQuestion(req, res) {
        try {
            const questionIndex = await Attempt.findOne({ user: req.user.id, quiz: req.quiz.id }, { current: 1 });
            if (questionIndex == req.quiz.questions.length) {
                return res.status(200).send({ message: 'You have attempted the quiz.' });
            }
            const question = await Quiz.aggregate([
                { $match: { _id: req.quiz.id } },
                { $project: { question: { $arrayElemAt: ['$quizes', questionIndex] } } }
            ]);
            res.status(200).send({ data: question[0].question });
        } catch (err) {
            Handler.#errorAndLog(err, res);
        }
    }
    static async postQuizQuestionAnswer(req, res) {
        try {
            const questionIndex = await Attempt.findOne({ user: req.user.id, quiz: req.quiz.id }, { current: 1 });
            if (questionIndex == req.quiz.questions.length) {
                return res.status(200).send({ message: 'You have attempted the quiz.' });
            }
            await Answer.create({ user: req.user.id, quiz: req.quiz.id, question: req.body.question, answer: req.body.answer });
            await Attempt.updateOne({ user: req.user.id, quiz: req.quiz.id }, { $inc: { current: 1 } }, { upsert: true });
        }

        catch (err) {
            Handler.#errorAndLog(err, res);
        }
    }
}

module.exports = Handler;