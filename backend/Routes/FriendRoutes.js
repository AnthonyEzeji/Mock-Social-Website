const express = require('express')

const mongoose = require('mongoose')
const userModel = require('../Models/UserModel')
const messagesModel = require('../Models/MessagesModel')
const router = express.Router()
const friendModel = require('../Models/FriendModel')


router.get('/:id', async (req,res)=>{
   try{
      var  friends=[]

      var friendsListToSend = []
    await friendModel.find({$or:[{user1:req.params.id}, {user2:req.params.id}]}).then(docs=>{
        
        for(var i = 0; i < docs.length; i++){
            if(docs[i].user1==req.params.id){
            
                friends.push(docs[i].user2)
            }else{
                friends.push(docs[i].user1)
            }

        }
       
    })
    console.log(friends)
    for(var i= 0; i < friends.length;i++){
        await userModel.findOne({id:friends[i]}).then(doc=>{
            newObj = {email:doc.email, userName:doc.userName, id:doc.id,_id:doc._id }
           friendsListToSend.push(newObj)
       })
   }
  return res.send(friendsListToSend)
   }catch(err){
       console.log(err)
       return res.send({error:err})
   }
})

module.exports = router