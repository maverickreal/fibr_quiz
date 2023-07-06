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
app.use('/user', Controller.router());

db.init().then(() => {
    console.log('Connected to database!');
    app.listen(process.env.USERAPIPORT, () => console.log('Started user API!'));
}).catch(err => {
    console.log(err);
    process.exit(1);
});