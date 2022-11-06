//this function checks if everything what is need is correct on start
const db = require('./mysql')
const config = require('./config.json')

function check() {
    db.query("SELECT * FROM place", function (err, result, fields) {
        if (err) throw err;
        if(result.length < config.place_col * (config.place_row))
        {
            console.log(`Database is not full: ${config.place_col * (config.place_row) - result.length}`)
    
            db.query("SELECT MAX(col) AS col , MAX(row) AS row FROM `place`", function (err, result, fields) { //it gives me current highest column and row number
                console.log(result)

                let col_ = result[0].col
                let row_ = result[0].row 

                if(col_ != null) {col_ = col_ + 1}

                if(col_ == null) col_ = 0
                if(row_ == null) row_ = 0
    
                console.log("columns:",col_)
                console.log("rows:",row_)
    
                let sql = `INSERT INTO place (col, row, color) VALUES`
                let added_cols = 0
          
                //somewhere here problem
                for (let index = col_ ; index < config.place_col; index++) { //this loop creates columns if some are missing
                    sql = sql + `(${index}, 1, '${config.default_color}'),`  //with one row     
                    added_cols = added_cols+1   
                }   
     
                console.log(`Added: ${added_cols} new columns`)
    
                for (let index = 0; index < col_ + added_cols; index++) { //this loop add new rows if needed
    
                    if(index <= col_) { //add new rows to columns that existed before
                        for (let i = row_ + 1; i <= config.place_row ; i++) {
                            sql = sql + `(${index}, ${i}, '${config.default_color}'),` 
                        }  
                    }
                    else { //add new rows to columns just created
                        for (let i = 2; i <= config.place_row ; i++) {
                            sql = sql + `(${index}, ${i}, '${config.default_color}'),` 
                        }         
                    }   
                }
    
                sql = sql.slice(0,-1) // deletes last comma in sql string
    
                db.query(sql, function (err, result, fields){
                    console.log(err)
                    console.log(`added new blocks`)
                })
            })
        }
    });
}


/*                                              //need to save this piece of code
const query = (sql) => {                        //it will be useful 
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
    let result = await query("SELECT * FROM place")
}*/

module.exports = {
    check: check
}