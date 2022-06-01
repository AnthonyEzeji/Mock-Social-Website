const express = require('express')

const mongoose = require('mongoose')
const userModel = require('../Models/UserModel')
const router = express.Router()


router.post('/', async (req,res)=>{
   try{
       
   await userModel.findOne({userName:req.body.userName}).then(doc=>{
if(doc){
    if(doc.password==req.body.password){
        
        req.session.isAuth = true
        req.session.user = doc
        res.send(req.session)
    }else{
       return res.send({message:'wrong password'})
    }
}else{
    return res.send({message:"username entered does not exist"})
}
   })
   }catch(err){
       console.log(err)
       return res.send({error:err})
   }
})
module.exports = router