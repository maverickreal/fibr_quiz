const express = require('express'),
    cors = require('cors'),
    helmet = require('helmet'),
    Controller = require('./api/controller/index.js'),
    db = require('./data/db/index.js'),
    container = require('./logic/utility/di/index.js');

const app = express();
const logger = container.resolve('logger');

db.init().catch(err => {
    logger.error(err);
    process.exit(1);
});

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/quiz', Controller.router());

if (process.env.ENV === 'test') {
    module.exports = app;
} else {
    app.listen(process.env.QUIZAPIPORT, () => logger.info('Started quiz API!'));
}