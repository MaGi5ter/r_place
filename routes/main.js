const express = require('express')
const router = express.Router()
const globals = require('../globals')
const db = require('../mysql')

router
    .route("/")
    .get((req,res) => {

        //its made in that way so bots dont get cookie with auth so easly
        if(req.session.simpleAuth == 1) {
            res.render('index',{
                blocks:  JSON.stringify(globals.block),
                hgh: JSON.stringify(globals.hgh)
            })
        }
        else {
            req.session.simpleAuth = 1
            setTimeout(() => {
                res.redirect('/')
            }, 500);
        }
    })

module.exports = router