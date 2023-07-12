const mongoose = require('mongoose');
const container = require('../../logic/utility/di/index.js');

class Db {
    static #logger = container.resolve('logger');
    static init = async () => {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        Db.#logger.info('Connected to database');
    }
}

module.exports = Db;