const socket = io()

function drawData(data) {
    data = JSON.parse(data)
    for (const i in data) {
        document.getElementById(`${data[i].col}.${data[i].row}`).style.backgroundColor = `#${data[i].color}`;
    }
}

function createGrid(hgh) {
    return new Promise((resolve) => {
        hgh = JSON.parse(hgh)
        let col = hgh[0].col
        let row = hgh[0].row
        for (let index = 0; index <= col; index++) {
            document.write(`<div class="column">`)
            for (let i = 1; i <= row; i++) {   
                document.write(`<div onclick="color_palette('${index}.${i}','${index}.${i}_')" id="${index}.${i}" class="row"> 
                <div class="cell" id="${index}.${i}_"></div>
                </div>`)
            }
            document.write(`</div>`)
        }
        resolve('a')
    })
}

let current_border = '0.1_'
let selected

function color_palette(id,id_cell) {
    let y = document.getElementById(id).getBoundingClientRect().top
    let x = document.getElementById(id).getBoundingClientRect().left
    let colr = document.getElementById("color")

    document.getElementById(id_cell).style.outline = "1px solid black"
    if(current_border != id_cell) {
        document.getElementById(current_border).style.outline = '0px solid black' ;current_border = id_cell
        selected = id
        colr.style.left = `${x+35}px`
        colr.style.top = `${y+6}px`
        colr.style.display = `block`
    } else {
        document.getElementById(current_border).style.outline = '0px solid black'
        colr.style.display = `none`
    }
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