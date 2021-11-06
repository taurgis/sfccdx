const hostname = require('./hostname');
const requiredString = require('./requiredString');

module.exports = {
    hostname,
    username: requiredString('username', 1),
    password: requiredString('password', 1),
    clientid: requiredString('clientid', 3),
    clientsecret: requiredString('clientsecret', 3),
};
