const express = require('express')
const router = express.Router()
const globals = require('../globals')

router
    .route("/")
    .get((req,res) => {
        ssn = req.session
        res.render('index',{
            blocks:  JSON.stringify(globals.block),
            hgh: JSON.stringify(globals.hgh)
        })
    })

module.exports = router