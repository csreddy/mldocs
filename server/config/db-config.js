'use strict';

var dev = {
    database: 'mldocs',
    host: "localhost", // The database app server host
    port: 8007, // By default port 8000 is enabled
    user: "admin", // A user with at least the rest-writer role
    password: "admin", // Probably not your password
    authType: "DIGEST" // The default auth
};

console.log('-----------------------------------------');
console.log('ENVIRONMENT:', process.env.NODE_ENV);
console.log('-----------------------------------------');

module.exports = {
    connection: dev
};