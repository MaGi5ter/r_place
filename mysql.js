const mysql = require('mysql')
const config = require('./config.json')

const db = mysql.createPool({
    host : config.db_server,
    user : config.db_username,
    password : config.db_password,
    database : config.db_databse,
    connectionLimit : 5,
    acquireTimeout  : 8000,
    timeout : 60000
})

module.exports = db