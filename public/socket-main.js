const socket = io()

function draw(arr)
{
    console.log('s')

    console.log(arr)
    draw(arr)
}

socket.on(`draw`, function (data) {
    
})

socket.on(`arr`, function (block) {

    draw(block)

})