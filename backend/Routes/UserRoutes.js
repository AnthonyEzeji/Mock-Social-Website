const express = require('express')

const mongoose = require('mongoose')
const userModel = require('../Models/UserModel')
const router = express.Router()


router.get('/:_id', async (req,res)=>{
   try{
       
    await userModel.findById(req.params._id).then(doc=>{
        
       return res.send({email:doc.email, userName:doc.userName, id:doc.id, _id:doc._id})
    })
   }catch(err){
       console.log(err)
       return res.send({error:err})
   }
})
module.exports = router