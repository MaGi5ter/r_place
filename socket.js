//SOCKET.IO
module.exports = async function (server) {
    const socket = require("socket.io");
    const io = socket(server);

    let maxVal = 0xFFFFFF; // 16777215
    let randomNumber = Math.random() * maxVal; randomNumber = Math.floor(randomNumber);
    randomNumber = randomNumber.toString(16);
    randomNumber.padStart(6, 0);

    console.log(randomNumber)

    function create_arr(rows,colls)
    {
        let arr = []

        for(let y = 0; y < colls;y++)
        {
            arr.push([])

            for(let x = 1; x <= rows;x++)
            {
                arr[y].push(randomNumber)
            }
        }
        return arr
    }


    var blocks = create_arr(100,100)

    io.on("connection", async function (socket) {

        //console.log('a')

        socket.emit('arr', blocks)

        socket.on("create", (data) => {
           
        })
    })
}