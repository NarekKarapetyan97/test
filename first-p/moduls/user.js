const express = require('express')
const rout = express.Router()
const crypto = require('crypto')
const sha256 = (x) => crypto.createHash('sha256').update(x).digest('hex')
const passport = require('passport')
const localsLib = require('../local')

const DB = require('../config.js')
//const { router } = require('../app.js');
//Routing

console.log(sha256('ed746956'))

//Validation

const { check, validationResult } = require('express-validator')
const { Server } = require('http')
const app = require('../app.js')

rout.post(
    '/register',
    [
        check('login')
            .notEmpty()
            .withMessage('Login cannot be empty')
            .isLength({ min: 5 })
            .withMessage('Login must be at least 5 characters '),
        check('pass').notEmpty().withMessage('Password cannot be empty'),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        console.log({ errors })
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() })
        }

        const { login, pass } = req.body
        if (login && pass) {
            try {
                console.log('hiiiiiiiiiiiii')

                await DB.pool.query(
                    `INSERT INTO users (name, login,pass) VALUE ( '','${login}','${sha256(
                        pass
                    )}')`
                )
                res.status(201).send({ msg: 'Created user' })
            } catch (err) {
                console.log(err)
                // res.send...
            }
        }
    }
)
const ee = (req, res, next) => {
    console.log('sssssss')
    next()
}

rout.post(
    '/login',
    localsLib.passportInit,
    ee,
    passport.authenticate('local'),
    (req, res) => {
        console.log('bbbbbb')
        console.log({ login: 'aaaaaaa' })
        res.send(2000)
    }
)

//rout.post('/login', async(req,resp)=>{
//let body=req.body;
//try{
//        check_user = await DB.pool.query(`Select * From users WHERE login = '${body.login}' AND pass = '${sha256(body.pass)}' `)
//        if(check_user[0].length>0) return resp.json({user:check_user[0][0], success:true})
//    }
//    catch(err){
//        console.log(err)
//    }
//})

//
//rout.post('/login', async (req, res)=>{
//
//  console.log(req.user);
//  if(req.user){
//   const result = await DB.promise().query('SELECT * FROM users ')
//    res.status(200).send(result[0])
//    } else {
//       res.status(403).send({msg:'Not Authenticated'})
//   }
//})
//
//

module.exports = rout

// application
//     node_modules
//     app
//         app.js
//     Server.js
//     package.json
