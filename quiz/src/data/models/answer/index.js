const mongoose = require('mongoose');
const Constant = require('../../../logic/utility/constant/index.js');

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