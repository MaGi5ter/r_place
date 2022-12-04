var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const placeBlockHeight = 30
const socket = io()

function color_data(color) {
    if(selected_block[0]){
        let data = [color,`${selected_block[0]/30}.${selected_block[1]/30}`]
        socket.emit('color_data',data)
        console.log('data emitted: ', data)
    }
}

socket.on(`alert`, function (data) {
    console.log(data)
    swal(data)
})

console.log(colors)

socket.on(`draw`, function (data) {

    let row = hgh[0].row //107
    let toEditIndex = (data[1][0]*row) - (row - data[1][1]) - 1
        
    colors[toEditIndex][2] = data[0]

    console.log(data)
    ctx.fillStyle = `#${data[0]}`;
    ctx.fillRect(data[1][0] * placeBlockHeight, data[1][1] *placeBlockHeight, placeBlockHeight, placeBlockHeight);
})

drawPlace(hgh,colors)
function drawPlace(hgh,colors) {

    let col = hgh[0].col
    let row = hgh[0].row

    canvas.width = placeBlockHeight * col
    canvas.height = placeBlockHeight * row

    for (const i of colors) {
        ctx.fillStyle = `#${i[2]}`;
        ctx.fillRect(i[0] * placeBlockHeight, i[1] *placeBlockHeight, placeBlockHeight, placeBlockHeight);
    }
}

let selected_block = []

document.onclick = e => {
    console.log(e.target.id)
    if(e.target.id != 'myCanvas') return
    if(selected_block[0]){
        drawPlace(hgh,colors)
    }
    let x = Math.floor(e.layerX/placeBlockHeight) *placeBlockHeight
    let y = Math.floor(e.layerY/placeBlockHeight) *placeBlockHeight
    selected_block = [x,y]
    console.log(`selected: ${selected_block[0]/30}.${selected_block[1]/30}`)

    ctx.rect(x,y,placeBlockHeight,placeBlockHeight)
    ctx.stroke()
    ctx.stroke()
}

//DRAG-SCROLL START

let draggable = false
let drag_start = []
let scroll_start = []

canvas.onmousemove = (e) => {
    //console.log(e.clientX,e.clientY,'| scrolle |', window.scrollY , window.scrollX)
    //console.log(draggable)
    if(draggable) {
        let xMove = scroll_start[0] + (drag_start[0]- e.clientX)
        let yMove = scroll_start[1] + (drag_start[1]- e.clientY)
        window.scrollTo(xMove,yMove)
    }
}

canvas.onmousedown = e => {
    draggable = true
    drag_start = [e.clientX,e.clientY]
    scroll_start = [window.scrollX,window.scrollY]
}
canvas.onmouseup = e => {
    draggable = false
}

canvas.onmouseout = e => {
    draggable = false
}
//DRAG-SCROLL END


document.addEventListener('contextmenu', e => {
    e.preventDefault()
})