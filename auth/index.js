require('dotenv').config();

const express = require('express'), cors = require('cors'),
      router = require('./controller/main.js');

require('./data/main.js').init();

const app = express();
app.use(express.json());
app.use(cors());
app.use(router);

if (process.env.ENV === 'test') {
    module.exports = app;
}
else {
    app.listen(process.env.PORT);
}