const mongoose = require('mongoose');
const Crypt = require('../../../logic/utility/crypt/index.js');

const localPasswordSchema = new mongoose.Schema({
    salt: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true,
        unique: true
    }
});

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        index: true
    },
    quizes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Quiz'
    },
    password: localPasswordSchema
});

userSchema.pre('save', function (next) {
    this.email = Crypt.encrypt(this.email);
    next();
});
userSchema.pre('load', function (next, doc) {
    doc.email = Crypt.decrypt(doc.email);
    next();
});

module.exports = mongoose.model('User', userSchema);