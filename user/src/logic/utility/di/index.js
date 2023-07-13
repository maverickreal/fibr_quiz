const awilix = require('awilix'),
    winston = require('winston'),
    path = require('path');

const container = awilix.createContainer();

container.register({
    logger: awilix.asValue(winston.createLogger({
        level: 'info',
        format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.json(),
            winston.format.prettyPrint()
        ),
        transports: [
            new winston.transports.File({ filename: path.join(__dirname, '../../../../meta/log/index.log.json'), level: 'error' })
        ]
    })),
    Constant: awilix.asValue(require('../constant/index.js')),
});

module.exports = container;