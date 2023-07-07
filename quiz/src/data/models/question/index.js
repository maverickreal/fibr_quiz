const mongoose = require('mongoose');
const Constant = require('../../../logic/utility/constant/index.js');

const localAnswerSchema = new mongoose.Schema({
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
    sequenceNumber: {
        type: Number,
        required: true
    },
    quiz: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true
    },
    question: {
        type: String,
        required: true
    },
    answer: {
        type: [localAnswerSchema],
        required: true,
        validate: {
            validator: ans => ans.length === Constant.maxNumberOfAnswers,
            message: `Answers must be ${Constant.maxNumberOfAnswers}.`
        }
    }
});

// questionSchema.createIndex({ quiz: 1, sequenceNumber: 1 }, { unique: true });

module.exports = mongoose.model('Question', questionSchema);