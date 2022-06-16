const express= require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const cors = require('cors')
const https = require('https')
const fs = require('fs')
const path = require('path')
const session = require('express-session')
const DB = process.env.DB
const UserRoutes = require('./Routes/UserRoutes')



const userModel = require('./Models/UserModel')
const LoginRoutes = require('./Routes/LoginRoutes')
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
app.use('/api/users',UserRoutes)


app.use('/api/login',LoginRoutes)
const sslServer = https.createServer(
    {
      key: fs.readFileSync(path.join(__dirname, 'cert', 'key.pem')),
      cert: fs.readFileSync(path.join(__dirname, 'cert', 'cert.pem')),
    },
    app
  )
 app.listen(PORT, () => console.log(`Secure server running on port: ${PORT}`))
