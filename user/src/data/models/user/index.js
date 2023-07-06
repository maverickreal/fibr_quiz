const mongoose = require('mongoose');

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
        match: /^ [\w -] + (\.[\w-]+) * @([\w -] +\.)+[a - zA - Z]{ 2, 7 } $ /,
        index: true
    },
    quizes: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Quiz'
    }
});

module.exports = mongoose.model('User', userSchema);