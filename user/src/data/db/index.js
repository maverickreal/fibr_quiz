const mongoose = require('mongoose');

class Db {
    static init = async () => {
        try {
            await mongoose.connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        } catch (err) {
            console.log(err);
        }
    }
}

module.exports = Db;