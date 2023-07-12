const express = require('express'),
      cors = require('cors'),
      helmet = require('helmet'),
      Controller = require('./api/controller/index.js'),
      container = require('./logic/utility/di/index.js');

const app = express();
const logger = container.resolve('logger');

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/auth', Controller.router());

if (process.env.ENV === 'test') {
      module.exports = app;
}
else {
      app.listen(process.env.AUTHAPIPORT, () => logger.info('Started auth API!'));
}