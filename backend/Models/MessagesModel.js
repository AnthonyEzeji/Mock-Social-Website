const mongoose = require('mongoose')




const schema = mongoose.Schema({sentFrom:Number,
    sentTo:Number,
    text:String,
    
 
},{timestamp:true})

const model = mongoose.model('messages', schema);


module.exports = model;