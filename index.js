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

db.query("SELECT * FROM place", function (err, result, fields) {
    if (err) throw err;
    if(result.length < config.place_col * config.place_row)
    {
        console.log(`Database is not full: ${config.place_col * config.place_row - result.length}`) //Add new 
        console.log(result[0])

        let col_ = 1
        let row_ = 1

        for (const i in result) {
            if(result[i].col > col_) col_ = result[i].col 
            if(result[i].row > row_) row_ = result[i].row
        }

        console.log(col_)
        console.log(row_)

            let sql = `INSERT INTO place (col, row, color) VALUES`
            
            for (let index = col_ ; index <= config.place_col; index++) { //every column
                console.log('pierwszy')
                for (let i = 1; i <= row_ ; i++) { //every row
                    console.log('pie')
                    sql = sql + `(${index}, ${i}, '${config.default_color}'),` 
                }            
            }

            db.query("SELECT * FROM place", function (err, result, fields) {
                let col_ = 1
                let row_ = 1

                for (const i in result) {
                    if(result[i].col > col_) col_ = result[i].col
                    if(result[i].row > row_) row_ = result[i].row
                }

                console.log(col_)
                console.log(row_)

                for (let index = 1; index <= config.place_col ; index++) { //every column
                    console.log('drug')
                    for (let i = row_ + 1; i <= config.place_row ; i++) { //every row
                        console.log('dru')
                        sql = sql + `(${index}, ${i}, '${config.default_color}'),` 
                    }            
                }
    
                sql = sql.slice(0,-1)
    
                db.query(sql, function (err, result, fields){
                    console.log(err)
                    console.log(`added new blocks`)
                })
    
                console.log(sql)

            })
    }
});

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

//ROUTES
const mainRoute = require("./routes/main")
app.use('/',mainRoute)