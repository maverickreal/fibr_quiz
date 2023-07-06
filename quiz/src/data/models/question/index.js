const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
    answer: {
        type: String,
        required: true
    },
    correct: {
        required: true,
        type: Boolean
    }
});

const questionSchema = new mongoose.Schema({
    question: {
        type: String,
        required: true
    },
    answers: {
        type: [answerSchema],
        required: true,
        validate: {
            validator: ans => ans.length === 4,
            message: 'Answers must be 4.'
        }
    }
});

module.exports = mongoose.model('Question', questionSchema);