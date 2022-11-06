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
                document.write(`<div id="${index}.${i}" class="row"></div>`)
            }
            document.write(`</div>`)
        }
        resolve('a')
    })
}