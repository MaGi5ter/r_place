const { block } = require('./globals');

//SOCKET.IO
module.exports = async function (server) {
    const socket = require("socket.io");
    const io = socket(server);
    const db = require('./mysql')

    io.on("connection", async function (socket) {
        socket.on("color_data", (data) => {
            data[1] = data[1].split('.')
            sql = ''

            let color

            if(data[0] != 'green'  && data[0] != 'blue' && data[0] != 'yellow' && data[0] != 'red') return
            else if (data[0] == 'green')
                color = '32CD32'
            else if (data[0] == 'blue') 
                color = '3333ff'
            else if (data[0] == 'red')
                color = 'ff3333'
            else if(data[0] == 'yellow')
                color = 'e8b833'

            sql = `UPDATE place SET color = '${color}' WHERE col = ${data[1][0]} AND row = ${data[1][1]}`
            db.query(sql,function (err) {
                if(err)throw err
            })

            let draw_data = [color,data[1]]
            io.emit('draw',draw_data)
            
           console.log(data)
        })
    })
}