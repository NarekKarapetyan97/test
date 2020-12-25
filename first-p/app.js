require('dotenv').config()
const express = require('express')
const app = express()
const formData = require('express-form-data')
const os = require('os')
const passport = require('passport')
const local = require('./local')
const cookieParser = require('cookie-parser')
const session = require('express-session')

const morgan = require('morgan')

const store = new session.MemoryStore()
//session
app.use(
    session({
        resave: true,
        secret: 'secret',
        cookie: { maxAge: 60000 },
        //not generate new every time
        saveUninitialized: false,
        store,
    })
)

const options = {
    uploadDir: os.tmpdir(),
    autoClean: true,
}

const path = require('path')

// My modules
const DB = require('./config.js')
app.use(morgan('dev'))

app.use(cookieParser())

// Api midelwares
app.use(express.json({ limit: '50MB', extended: true }))
app.use(formData.parse(options))

app.use('/', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header(
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin, Authorization, Content-Type, Accept'
    )
    next()
})

//function validateCookie(req,res,next){
//  const {cookies} = req;
//  if ('session_id' in cookies){
//    console.log('Session_id exists');
//    if(cookies.session_id ==='123456'){
//
//      next();
//    }else res.status(403).send({msg:'Not autintaced'})
//  }else res.status(403).send({msg:'Not autintaced'})
//
//}
//
//app.get('/signin', (req,res)=>{
//  res.cookie('sessiom_id', '123456');
//
//})
//
//app.get('/protected', validateCookie, (req, res)=>{
//  res.status(200).json({msg: 'Your are authorized'})
//})
//
//app.post('/login', (res,req) =>{
//  const {login, pass} = req.body;
//  if(login && pass){
//    if(req.session.authenticated){
//      res.json(req.session);
//    }else{
//      if(pass === "same hashed"){
//      req.session.authenticated = true;
//      req.session.user = {
//        login, pass
//      };
//      res.json(req.session);
//    }else {
//          res.status(403).json({msg:'Bad Credentioals'})
//    }
//  }
//}else res.status(403).json({msg:'Bad Credentioals'});
//  res.send(200)
//})

app.use(passport.initialize())
app.use(passport.session())

const user = require('../first-p/moduls/user.js')

app.use('/user', user)

module.exports = app
