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
app.use('/auth', Controller.router());
app.use(express.json());

app.listen(process.env.AUTHAPIPORT, () => console.log('Started user API!'));