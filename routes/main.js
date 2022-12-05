const express = require('express')
const router = express.Router()
const globals = require('../globals')
const config = require('../config.json')
const request = require('request')

router
    .route("/")
    .get((req,res) => {

        if(req.session.simpleAuth == 1) {
            res.render('index',{
                blocks:  JSON.stringify(globals.block),
                hgh: JSON.stringify(globals.hgh)
            })
        }
        else {
            res.render('captcha' ,{
                captcha: config['captcha-client']
            })
        }
    })
    .post((req,res) => {
        
        if(req.body['g-recaptcha-response'] == undefined )
        return

        const secretKey = config['captcha-server']
        const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body['g-recaptcha-response']}&remoteip=${req.connection.remoteAddress}`

        request(verifyURL, (err,response,body) => {
            body = JSON.parse(body)

            console.log(body)

            if(body.success == false) {
                res.redirect('/')
                return
            }
            else if(body.success == true) {
                req.session.simpleAuth = 1
                res.redirect('/')
            }

        })
    })

module.exports = router