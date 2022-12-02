const globals = require('./globals');
const socket = require("socket.io");
const db = require('./mysql');
const config = require('./config.json');

const cooldown = 500
//cooldown how often user can edit block

const persec_limit = 0.8
const perMinuteIp = 480 //how many per minute == ban

var ipBlock = []
const limitFromSingleIp = 8
//anti spamming bots 


//to do trust factor

//SOCKET.IO
module.exports = async function (server) {
    const io = socket(server);
    io.on("connection", async function (socket) {

        var clientIp = socket.request.connection.remoteAddress;
        //console.log(clientIp);

        const findIP = ipBlock.findIndex(element => element[0] == clientIp)

        let disc = {
            title: "Disconnected",
            text: "Too many connections from same IP",
            icon: 'warning',
            dangerMode: true,
        }

        if(findIP >= 0) {
            if(ipBlock[findIP][1] >= limitFromSingleIp) {
                socket.emit('alert',disc)
                socket.disconnect()
                return
            }
            ipBlock[findIP][1] = ipBlock[findIP][1] + 1
        }
        else {
            ipBlock.push([clientIp,1])
        }

        console.log(ipBlock[findIP])

        const user = [socket.id,Date.now(),0,Date.now(),cooldown]
        socket.on('disconnect', (data) => {
            console.log(socket.id,' disconnected')
            try {
                ipBlock[findIP][1] = ipBlock[findIP][1] -1   
            } catch (error) {}
        })

        socket.on("color_data", (data) => {

            user[2] += 1
            let persec = (Date.now()-user[3])/1000/Math.abs(user[2])
            console.log(persec)

            if(persec < persec_limit){
                socket.disconnect()
                return
            }

            let test = {
                title: "Slow down",
                text: "You are sending too much edits, there is small cooldown for everyone",
                icon: 'warning',
                dangerMode: true,
            }

            if(Date.now() - user[1] < cooldown) {
                socket.emit('alert',test)
                return
            }
            else user[1] = Date.now()


            // if(Date.now() - user[3] > 15000){
            //     user[3] = Date.now()
            //     user[2] = 0
            // }

            // console.log('b')
            
            try {
                data[1] = data[1].split('.')   
            } catch (error) {
                if(error) socket.emit('alert','SUS')
                return
            }
            sql = ''

            let color

            if(data[0] != 'green'  && data[0] != 'blue' && data[0] != 'yellow' && data[0] != 'grey' && data[0] != 'red' && data[0] != 'pink') return
            else if (data[0] == 'green')
                color = '32CD32'
            else if (data[0] == 'blue') 
                color = '3333ff'
            else if (data[0] == 'red')
                color = 'ff3333'
            else if(data[0] == 'yellow')
                color = 'e8b833'
            else if(data[0] == 'grey')
                color = 'A9A9A9'
            else if(data[0] == 'pink')
                color = 'FF8DA1'

            sql = `UPDATE place SET color = '${color}' WHERE col = ${data[1][0]} AND row = ${data[1][1]}`

            if(sql.toLowerCase().includes('truncate'))
            {
                socket.disconnect()
                console.log(sql)
                return
            }

            console.log(sql)

            db.query(sql,function (err) {
                if(err)throw err
                else {

                    let draw_data = [color,data[1]]
                    io.emit('draw',draw_data)
                    let index = ((parseInt(data[1][0])-1) * parseInt(config.place_row) + parseInt(data[1][1]))-1                  
                    globals.block[index][2] = color
                    
                }
            })
        })
    })
}