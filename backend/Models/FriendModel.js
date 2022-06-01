const mongoose = require('mongoose')




const schema = mongoose.Schema({user1:Number,
  user2:Number
    
 
},{timestamp:true})

const model = mongoose.model('friends', schema);


module.exports = model;