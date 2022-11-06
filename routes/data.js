const express = require('express')
const router = express.Router()
const globals = require('../globals')

router
    .route("/")
    .get((req,res) => {
        res.send(globals.block)
        console.log(globals.block)
    })

module.exports = router