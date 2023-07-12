const Question = require('../../data/models/question/index.js'),
    Quiz = require('../../data/models/quiz/index.js'),
    Attempt = require('../../data/models/attempt/index.js'),
    Answer = require('../../data/models/answer/index.js'),
    container = require('../utility/di/index.js');

const Constant = container.resolve('Constant');

class Handler {
    static #logger = container.resolve('logger');
    static #errorAndLog(err, res) {
        Handler.#logger.error(err);
        res.status(500).send();
    }
    static async #getScore(req, answers) {
        let score = 0;
        for (let ind = 0; ind < answers.length; ++ind) {
            const userAns = answers[ind].answer,
                questionId = req.quiz.questions[ind],
                question = await Question.findById(questionId);
            const actualAns = [];
            for (let ind = 0; ind < question.answers.length; ++ind) {
                if (question.answers[ind].correct) {
                    actualAns.push(ind);
                }
            }
            if (userAns.length === actualAns.length && userAns.every(value => actualAns.includes(value))) {
                ++score;
            }
        }
        return score;
    }
    static async createQuiz(req, res) {
        try {
            let quiz = await Quiz.findOne({ title: req.body.title });
            if (quiz) {
                return res.status(409).send({ message: 'Quiz already exists.' });
            }
            quiz = await Quiz.create({
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
            const linkToTheQuiz = `${process.env.QUIZAPIURL}${Constant.quizApiQuizQuestionPath}?title=${quiz.title}`;
            res.status(201).send({ message: `Quiz created. Acces it at: ${linkToTheQuiz}` });
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
    static async getQuizScore(req, res) {
        try {
            const attempt = await Attempt.findOne(
                { quiz: req.quiz._id, user: req.user._id }
            );
            if (!attempt || attempt.current != req.quiz.questions.length) {
                return res.status(200).send({ message: 'You have not attempted the quiz.' });
            }
            const answers = await Answer.find({ quiz: req.quiz._id, user: req.user._id }, { answer: 1 });
            const score = await Handler.#getScore(req, answers);
            res.status(200).send({ score });
        } catch (err) {
        }
    }
}

module.exports = Handler;