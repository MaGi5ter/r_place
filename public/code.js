const socket = io()

function drawData(data) {
    data = JSON.parse(data)

    for (const i of data) {
        document.getElementById(`${i[0]}.${i[1]}`).style.backgroundColor = `#${i[2]}`;
    }
}

function createGrid(hgh) {
    return new Promise((resolve) => {
        hgh = JSON.parse(hgh)
        let col = hgh[0].col
        let row = hgh[0].row
        for (let index = 1; index <= col; index++) {
            document.write(`<div class="column">`)
            for (let i = 1; i <= row; i++) {   
                document.write(`<div onclick="color_palette('${index}.${i}','${index}.${i}_',event)" id="${index}.${i}" class="row"> 
                <div class="cell" id="${index}.${i}_"></div>
                </div>`)
            }
            document.write(`</div>`)
        }
        resolve('a')
    })
}

let current_border = '1.1_'
let selected

function color_palette(id,id_cell,event) {
    let colr = document.getElementById("color")
    document.getElementById(id_cell).style.outline = "1px solid black"
    if(current_border != id_cell) {
        document.getElementById(current_border).style.outline = '0px solid black' ;current_border = id_cell
        selected = id
        console.log(event.clientX)

        let x = event.clientX + 5
        let y = event.clientY + 5

        let winWidth = window.innerWidth
        let winHeight = window.innerHeight

        x = x > winWidth - colr.offsetWidth ? x - 120 : x
        y = y > winHeight - colr.offsetHeight ? y - 50 : y


        colr.style.left = `${x}px`
        colr.style.top = `${y}px`
        colr.style.display = `block`
    } else {
        document.getElementById(current_border).style.outline = '0px solid black'
        colr.style.display = `none`
    }
}

document.onscroll = () => {
    let colr = document.getElementById("color")
    document.getElementById(current_border).style.outline = '0px solid black'
    colr.style.display = `none`
}

function color_data(color) {
    let data = [color,selected]
    socket.emit('color_data',data)
    console.log('data emitted: ', data)
}

socket.on(`draw`, function (data) {
    id = `${data[1][0]}.${data[1][1]}`
    let el = document.getElementById(id)
    el.style.backgroundColor = `#${data[0]}`
})

//const contextMenu = document.getElementById('color')
document.addEventListener('contextmenu', e => {
    e.preventDefault()
})

socket.on(`alert`, function (data) {
    console.log(data)
    swal(data)
})