const express = require('express'),
    cors = require('cors'),
    helmet = require('helmet'),
    morgan = require('morgan'),
    controller = require('./src/api/controller/index.js'),
    db = require('./src/data/index.js');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('tiny'));
app.use(controller);

db.init().then(() => {
    console.log('Connected to database!');
    app.listen(process.env.USERAPIPORT, () => console.log('Started user API!'));
}).catch(err => {
    console.log(err);
    process.exit(1);
});