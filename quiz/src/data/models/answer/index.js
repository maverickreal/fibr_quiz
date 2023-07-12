const mongoose = require('mongoose');
const container = require('../../../logic/utility/di/index.js');

const Constant = container.resolve('Constant');

const answerSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    question: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Question',
        required: true
    },
    answer: {
        type: [Number],
        default: [],
        validate: {
            validator: ans => ans.length <= Constant.maxNumberOfAnswers
        }
    }
});

module.exports = mongoose.model('Answer', answerSchema);