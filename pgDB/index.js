const pgp = require('pg-promise')();
const dbConfig = require('./pgConfig')
let connectionObj = {
        user: dbConfig.DB_USER,
        database: dbConfig.DB_NAME,
        password: dbConfig.DB_PASS,
        host: dbConfig.DB_HOST
    };


// console.log(pgp)
//
// //export db instance to be shared
module.exports = pgp(connectionObj);
