const express = require('express'),
    cors = require('cors'),
    helmet = require('helmet'),
    Controller = require('./api/controller/index.js'),
    Db = require('./data/db/index.js'),
    container = require('./logic/utility/di/index.js');

const app = express();
const logger = container.resolve('logger');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/user', Controller.router());

Db.init().catch(err => {
    logger.error(err);
    process.exit(1);
});

if (process.env.ENV === 'test') {
    module.exports = app;
} else {
    app.listen(process.env.USERAPIPORT, () => logger.info('Started user API!'));
}