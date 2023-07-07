const express = require('express'),
    cors = require('cors'),
    helmet = require('helmet'),
    morgan = require('morgan'),
    Controller = require('./api/controller/index.js'),
    db = require('./data/db/index.js');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use('/quiz', Controller.router());
app.use(express.json());

db.init().catch(err => {
    console.log(err);
    process.exit(1);
});

if (process.env.ENV === 'test') {
    module.exports = app;
} else {
    app.listen(process.env.QUIZAPIPORT, () => console.log('Started quiz API!'));
}