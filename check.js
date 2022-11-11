//this function checks if everything what is need is correct on start
const db = require('./mysql')
const config = require('./config.json')
const globals =require('./globals')

function check() {
    //this function checks if database is correct with config
    const query = (sql) => {return new Promise((resolve, reject) => {db.query(sql, (err, rows) => {if(err) {return reject(err);}return resolve(rows)})})}
    function sorter(a,b){return a[0] - b[0]}

    const arr = (data) => {
        return new Promise((resolve) => {
            let a = [];
            async function yep() {
                for (const i in data) {
                    a.push([data[i].col,data[i].row,data[i].color])
                }
                a = a.sort(sorter);return a   
            }
            return resolve(yep())
        })
    }

    query("SELECT MAX(col) AS col , MAX(row) AS row FROM `place`").then((high) => {globals.hgh = high})

    query("SELECT * FROM place").then((data) => {
    arr(data).then((dat) => {
        if(dat.length < 1) {
            console.log('nothing here')
            //creates command that will create database with data, based on config values
            let sql = `INSERT INTO place (col, row, color) VALUES`
            for (let index = 1; index <= config.place_col; index++) {
                for (let i = 1; i <= config.place_row; i++) {
                    sql = sql + `(${index}, ${i}, '${config.default_color}'),` 
                }
            } ; sql = sql.slice(0,-1)
            db.query(sql, function (err){
                if(err){
                    console.log('something went wrong on adding data #39_check.js')
                }
                else {console.log('database was empty,so it was filled with data'),check()}
            })
        }
        else if(dat.length < config.place_col * config.place_row) {
            console.log('something is lost')
            //creates command that will add data to current database
            let sql = `INSERT INTO place (col, row, color) VALUES`
            for (let index = 1; index <= config.place_col; index++) {
                for (let i = 1; i <= config.place_row; i++) {
                    var found = dat.find((element)=>{
                        if(element[0] == index && element[1] == i) return element
                    })
                    if(found == undefined) {
                        sql = sql + `(${index}, ${i}, '${config.default_color}'),` 
                    }
                }
            } ; sql = sql.slice(0,-1)
            db.query(sql, function (err){
                if(err){
                    console.log('something went wrong on adding data #59_check.js')
                }
                else {console.log('database was incomplete,so it was filled with data'),check()}
            })
        }
        else if(data.length = config.place_col * config.place_row) {
            console.log('ok')
            globals.block = dat
        }

    })})
}

module.exports = {
    check: check
}