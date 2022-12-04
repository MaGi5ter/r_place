const express = require('express')
const session = require('express-session')

const config = require('./config.json')
const socket = require("socket.io");
const globals = require('./globals')
const PORT = 40387

//APP SETUP
const app = express()
const oneHour = 1000 * 60 * 60;

const sessionMiddleware = session({
    secret: config.express_session_secret,
    saveUninitialized:true,
    cookie: { maxAge: oneHour },
    resave: false,
})

app.use(sessionMiddleware)
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
const io = socket(server);

const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);
io.use(wrap(sessionMiddleware))

const socket_cod = require('./socket.js')
socket_cod(io)

//these functions need to start everytime when starts program
const check = require('./check')
check.check()

//ROUTES
const mainRoute = require("./routes/main")
app.use('/',mainRoute)

const dataRoute = require("./routes/data")
app.use('/block',dataRoute)