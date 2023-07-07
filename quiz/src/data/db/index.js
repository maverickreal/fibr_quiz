const mongoose = require('mongoose');

class Db {
    static init = async () => {
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }
}

module.exports = Db;