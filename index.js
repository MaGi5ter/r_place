const express = require('express')
const session = require('express-session')

const config = require('./config.json')
const globals = require('./globals')
const PORT = 4200

//APP SETUP
const app = express()

app.use(express.json())
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true}))
app.use(express.static(__dirname + '/public'))

const server = app.listen(PORT, function () {
    console.log(`Listening on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});

//MYSQL
const db = require('./mysql')

//SOCKET.IO
const socket_cod = require('./socket.js')
socket_cod(server)

//SESSION
const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: config.express_session_secret,
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));

//these functions need to start everytime when starts program
const check = require('./check')
check.check()

const query = (sql) => {                         
    return new Promise((resolve, reject) => {
        db.query(sql, (err, rows) => {
            if(err) {
                return reject(err);
            }           
            return resolve(rows)
        })
    }) 
}

onStartMSQLcheck()
async function onStartMSQLcheck(){
    globals.block = await query("SELECT * FROM place")
    globals.hgh = await query("SELECT MAX(col) AS col , MAX(row) AS row FROM `place`")
}   

//ROUTES
const mainRoute = require("./routes/main")
app.use('/',mainRoute)

const dataRoute = require("./routes/data")
app.use('/block',dataRoute)