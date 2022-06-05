

const express = require('express')

const mongoose = require('mongoose')
const userModel = require('../Models/UserModel')
const messagesModel = require('../Models/MessagesModel')
const router = express.Router()


router.get('/:_id', async (req,res)=>{
    
   try{
      
    var messages = []
    var user = {}
    var otherUsersId =[]
    var uniqueIds= []
    var otherUserObjectList = []
       var response = []
     await userModel.findById(req.params._id).then(doc=>{
   
         user = doc
    })
   await  messagesModel.find({$or:[{sentTo:user.id}, {sentFrom:user.id}]}).then(doc1=>{
        messages = doc1
    })
    for(var i = 0; i <messages.length;i++){
        if(messages[i].sentFrom==user.id){
            otherUsersId.push(messages[i].sentTo)
        }else{
          otherUsersId.push(messages[i].sentFrom)
        }
    }
     uniqueIds = [... new Set(otherUsersId)]
   
    
    for(var i = 0; i < uniqueIds.length;i++){
        await userModel.findOne({id:uniqueIds[i]}).then(doc2=>{
            
        otherUserObjectList[i]=(doc2) 
        })
        
    }
    
    for(var i = 0; i < otherUserObjectList.length;i++){
    await  messagesModel.find({$or:[{sentFrom:user.id, sentTo:otherUserObjectList[i].id},{sentFrom:otherUserObjectList[i].id, sentTo:user.id}]}).then(doc3=>{
          

          chatObj = {messages:doc3, otherUser:otherUserObjectList[i]}
          response.push(chatObj)
      })
      
    }
    console.log(response)
return res.send(response)
    
   }catch(err){
       console.log(err)
       return res.send({error:err})
   }
})
router.get('/:_id/:userName', async (req,res)=>{
    try{
        console.log('hit')
        var messages = []
        var user = {}
        var response = []
      await userModel.findOne({userName:req.params.userName}).then(doc=>{
          user = doc
         
         

     })
    await messagesModel.find({$or:[{sentTo:user.id}, {sentFrom:user.id}]}).then(doc1=>{
        
        messages = doc1
        
     })
     

     for(var i =0; i < messages.length;  i++){
        if(messages[i].sentFrom == user.id || messages[i].sentTo == user.id){
            response.push(messages[i])
        }
    }
    return res.send(response)
    }catch(err){
        console.log(err)
        return res.send({error:err})
    }
 })
module.exports = router