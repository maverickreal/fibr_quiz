const express = require('express'),
      cors = require('cors'),
      helmet = require('helmet'),
      morgan = require('morgan'),
      Controller = require('./api/controller/index.js');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(express.json());
app.use('/auth', Controller.router());

if (process.env.ENV === 'test') {
      module.exports = app;
}
else {
      app.listen(process.env.AUTHAPIPORT, () => console.log('Started auth API!'));
}