const awilix = require('awilix');
const Crypt = require('../utility/crypt.js');

const container = awilix.createContainer();
container.register({
    allowedUpdates: awilix.asValue(['firstName', 'lastName', 'age']),
    encryptedFields: awilix.asValue(new Set(['firstName', 'lastName', 'phoneNumber', 'email'])),
    crypt: awilix.asValue(new Crypt())
});

module.exports = container;