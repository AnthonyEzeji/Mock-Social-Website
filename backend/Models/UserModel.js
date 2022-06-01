const mongoose = require('mongoose')




const schema = mongoose.Schema({id : Number,
 userName:String,
 email:String,
 password:String
},{timestamp:true})

const model = mongoose.model('users', schema);


module.exports = model;