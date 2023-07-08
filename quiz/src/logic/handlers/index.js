const Question = require('../../data/models/question/index.js'),
    Quiz = require('../../data/models/quiz/index.js'),
    Attempt = require('../../data/models/attempt/index.js'),
    Answer = require('../../data/models/answer/index.js');

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
            let attempt = await Attempt.findOne({ user: req.user._id, quiz: req.quiz._id });
            if (attempt === null) {
                attempt = await Attempt.create({ user: req.user._id, quiz: req.quiz._id });
            }
            const { current: questionIndex } = attempt;
            if (questionIndex == req.quiz.questions.length) {
                return res.status(200).send({ message: 'You have attempted the quiz.' });
            }
            const quizes = await Quiz.aggregate([
                { $match: { _id: req.quiz._id } },
                { $project: { question: { $arrayElemAt: ['$questions', questionIndex] } } }
            ]);
            const question = await Question.findById(quizes[0].question, { question: 1, answers: 1, _id: 0 });
            const qna = { question: question.question, answers: question.answers.map(a => a.answer) };
            res.status(200).send({ data: qna });
        } catch (err) {
            Handler.#errorAndLog(err, res);
        }
    }
    static async postQuizQuestionAnswer(req, res) {
        try {
            let attempt = await Attempt.findOne({ user: req.user._id, quiz: req.quiz._id });
            if (attempt === null) {
                attempt = await Attempt.create({ user: req.user._id, quiz: req.quiz._id });
            }
            const { current: questionIndex } = attempt;
            if (questionIndex == req.quiz.questions.length) {
                return res.status(200).send({ message: 'You have attempted the quiz.' });
            }
            await Answer.create({ user: req.user._id, quiz: req.quiz._id, question: req.quiz.questions[questionIndex], answer: req.body.answer });
            await Attempt.updateOne({ user: req.user._id, quiz: req.quiz._id }, { $inc: { current: 1 } }, { upsert: true });
            res.status(200).send({ message: 'Answer submitted' });
        } catch (err) {
            Handler.#errorAndLog(err, res);
        }
    }
}

module.exports = Handler;