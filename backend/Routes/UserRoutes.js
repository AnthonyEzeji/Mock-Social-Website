const express = require('express')

const mongoose = require('mongoose')
const userModel = require('../Models/UserModel')
const router = express.Router()


router.get('/1/:_id', async (req,res)=>{
   try{
       
    await userModel.findById(req.params._id).then(doc=>{
        
       return res.send({email:doc.email, userName:doc.userName, id:doc.id, _id:doc._id})
    })
   }catch(err){
       console.log(err)
       return res.send({error:err})
   }
})
router.get('/2/:id', async (req,res)=>{
   try{
       
    await userModel.findOne({id:req.params.id}).then(doc=>{
        
       return res.send({email:doc.email, userName:doc.userName, id:doc.id, _id:doc._id})
    })
   }catch(err){
       console.log(err)
       return res.send({error:err})
   }
})
router.get('/:userName', async (req,res)=>{
    try{
        console.log(req.params)
     await userModel.findOne({userName:req.params.userName}).then(doc=>{
         
        return res.send({email:doc.email, userName:doc.userName, id:doc.id, _id:doc._id})
     })
    }catch(err){
        console.log(err)
        return res.send({error:err})
    }
 })
 router.post('/', async (req,res)=>{
   try{
      await userModel.findOne({userName:req.body.userName}).then(doc=>{
         
         if(doc==null){
            console.log(req.body)
            var id = Math.floor(Math.random() * (1000000000000 - 1 + 1) + 1)
          userModel.create({userName:req.body.userName, password:req.body.password, email:req.body.userName+"@mywebsite.com", id:id }).then(doc=>{
             
            return res.send({email:doc.email, userName:doc.userName, id:doc.id, _id:doc._id})
         })
         }else{
            res.send({message:"username exists already"})
         }
      })
      
   }catch(err){
       console.log(err)
       return res.send({error:err})
   }
})

module.exports = router