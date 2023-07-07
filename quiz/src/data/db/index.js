const mongoose = require('mongoose');

class Db {
    static init = async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connected to database');
    }
}

module.exports = Db;