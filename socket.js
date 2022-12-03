const globals = require('./globals');
const socket = require("socket.io");
const db = require('./mysql');
const config = require('./config.json');

const tenSecLimit = 12          //how many req from single socket in 10 seconds
const limitFromSingleIp = 8     //limit of simualtoensly connected sockets from same id
let ipBlock = []                //list of ever connected ip , to check if sb is connecting to often
let blacklist = []              //blacklist of ips that were considered as bots
//anti spamming bots

//fast normal clicking gives about 12 - 13 per 10 seconds about 0.76 delay beetwen clicks

//SOCKET.IO
module.exports = async function (server) {
    const io = socket(server);
    io.on("connection", async function (socket) {

        var clientIp = socket.request.connection.remoteAddress
        //console.log(clientIp);
        const findIP = ipBlock.findIndex(element => element[0] == clientIp)

        if(findIP >= 0) {
            if(ipBlock[findIP][1] >= limitFromSingleIp) {
                socket.emit('alert',disc)
                socket.disconnect()
                return
            }
            ipBlock[findIP][1] = ipBlock[findIP][1] + 1
        }
        else {
            ipBlock.push([clientIp,1,tenSecLimit,[[],[]]])
        }

        socket.on('disconnect', (data) => {
            console.log(socket.id,' disconnected')
            try {
                ipBlock[findIP][1] = ipBlock[findIP][1] -1   
            } catch (error) {}
        })

        let socketCooldownCount = []
        //here are stored every requests from specified user [dateofirstrequest.................dateoflastrequest]

        socket.on("color_data", (data) => {

            try {
                socketCooldownCount.push(Date.now()) 
                ipBlock[findIP][3][1].push(Date.now())   
            } catch (error) {
                if(error) return
            }
            
            if(Date.now() - socketCooldownCount[0] > 10000) {  //if last request is older than 10secs removes it
                while(Date.now() - socketCooldownCount[0] > 10000){
                    socketCooldownCount = socketCooldownCount.slice(1)
                }                   
            }

            if(Date.now() - ipBlock[findIP][3][1][0] > 60000) {  //if last request is older than one minute removes it
                while(Date.now() - ipBlock[findIP][3][1][0] > 60000){
                    ipBlock[findIP][3][1] = ipBlock[findIP][3][1].slice(1)   
                }             
            }
  
            let ipPerMinute         = ipBlock[findIP][3][1].length  
            let socketPerTenSeconds = socketCooldownCount.length    //Maximum is declared in variable above

            if(socketPerTenSeconds > tenSecLimit) {
                socket.emit('alert',toomuchrequests)
                return
            }

            if(ipPerMinute > (ipBlock[findIP][2] * limitFromSingleIp) * 3.8 ) {
                //if that happens its huge chance that there are bots sending requests

                if(ipBlock[findIP][2] > 0) {
                    ipBlock[findIP][2] = ipBlock[findIP][2] - 1
                }
                ipBlock[findIP][3][1] = ipBlock[findIP][3][1].slice(1,ipBlock[findIP][3][1].length)
                socket.emit('alert',probablyBot )
                return
            }

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
                color = '32cd5e'
            else if (data[0] == 'blue') 
                color = '3333ff'
            else if (data[0] == 'red')
                color = 'e64747'
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

            db.query(sql,function (err) {
                if(err)throw err
                else {

                    console.log('edited by ',clientIp,' ',socket.id,' || ',data[1][0],',',data[1][1],' || ip: ',ipPerMinute,'socket: ',socketPerTenSeconds)

                    let draw_data = [color,data[1]]
                    io.emit('draw',draw_data)
                    let index = ((parseInt(data[1][0])-1) * parseInt(config.place_row) + parseInt(data[1][1]))-1                  
                    globals.block[index][2] = color
                    
                }
            })
        })
    })
}

let probablyBot = {
    title: "Detected something SUSpicous",
    text: "You IP is sending too much requests, so your cooldwon was increased",
    icon: 'warning',
    dangerMode: true,
}

let toomuchrequests = {
    title: "Slow down",
    text: "Too much edits, wait a while (10sec)",
    icon: 'warning',
    dangerMode: true,
}

let disc = {
    title: "Disconnected",
    text: "Too many connections from same IP",
    icon: 'warning',
    dangerMode: true
}