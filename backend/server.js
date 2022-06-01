const express= require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const https = require('https')
const fs = require('fs')
const path = require('path')
const session = require('express-session')
const DB = process.env.DB
mongoose.connect(DB,{useNewUrlParser: true,
    useUnifiedTopology: true }, ()=>console.log('successfully connected to db...'))
var app = express()
app.use(cors(),express.json())
app.use(session({
    secret:"secret key",
    resave:false,
    saveUninitialized : false,
    cookie:{
httpOnly:false,
maxAge : 3600000
    }
}))
const PORT = process.env.PORT
const sslServer = https.createServer(
    {
      key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
    },
    app
  )
  sslServer.listen(PORT, () => console.log(`Secure server on port: ${PORT}`))