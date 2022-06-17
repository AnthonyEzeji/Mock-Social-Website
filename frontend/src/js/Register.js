import { Button , Input} from '@mui/material'
import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router'
import {addDoc, collection, serverTimestamp} from 'firebase/firestore'
import {db} from './Firebase'
import '../css/Register.css'


function Register() {
    var navigate = useNavigate()
    const [userName, setUserName] = useState('')
    const [password, setPassword] = useState('')
    const [bool, setBool] = useState(false)
    const [bool2, setBool2] = useState(false)
    const [bool3, setBool3] = useState(false)
    const [bool4, setBool4] = useState(false)
    const [bool5, setBool5] = useState(false)
    const [bool6, setBool6] = useState(false)
    function hasWhiteSpace(s) {
        const whitespaceChars = [' ', '\t', '\n'];
        return whitespaceChars.some(char => s.includes(char));
      }
    async function handleCreateClick(){
        if(hasWhiteSpace(password)){
            setBool2(false)
            setBool6(true)


        }else{
            if(hasWhiteSpace(userName)){
                setBool4(false)
                setBool5(true)
            }else{
                if(password.length<8){
                    setBool2(true)
                            }else{
                                if(userName.length<=20){
                                    
                                    if(userName.length!=0){
                                        
                                        await axios.post(`http://3.92.186.223:5000/api/users/`, {userName,password}).then(res=>{
                               
                                            if(res.data.hasOwnProperty('message')){
                                                console.log(res.data.message)
                                                setBool(true)
                                            }else{
                                                
                                                console.log(res.data)
                                                const usersRef=collection(db, "users")
                                                addDoc(usersRef,{userName:res.data.userName, avatar:"",bio:"",likes:[], createdAt:serverTimestamp()})
                                            }
                                        })
                                    }else{
                                        setBool5(false)
                                        setBool(false)
                                        setBool3(false)
                                        setBool4(true)
                                    }
                                }else{
                                    setBool(false)
                                    setBool3(true)
                    
                                }
                                
                            }
    
            }
           
        }
       
   
       
    }
  return (
    <div style={{display:"flex", justifyContent:"center", alignItems:"center", height:'100vh'}} className = "register">

        <div style={{borderRadius:15,boxShadow: "rgb(0, 0, 0) 0px 20px 30px -10px",padding:'20px', color:"black", display:'flex', flexDirection:'column', width:"50%", justifyContent:'center', alignItems:'center'}} className="form">
            <h5 style ={{color:"white"}}>Register</h5>
            {bool&&<div>Username Taken already</div>}
            {bool3&&<div>Username Too long! 20 characters or less</div>}
            {bool4&&<div>Username Too short!</div>}
            {bool5&&<div>Username contains spaces</div>}
            <p style={{width:185,margin:0,textAlign:"center", padding:"5px",backgroundColor:'grey', color:"white"}}>enter username below</p>
        <Input onChange={(e)=>{setUserName(e.target.value)}} style={{backgroundColor:"white"}}>
        
        </Input>
        {bool2&&<div>Password too short</div>}
        {bool6&&<div>Password Contains spaces</div>}
        <p style={{width:185,margin:0,marginTop:10,textAlign:"center", padding:"5px",backgroundColor:'grey', color:"white"}}>enter password below</p>
        <Input onChange={(e)=>{setPassword(e.target.value)}}  style={{backgroundColor:"white"}}>
        
        </Input>
        <Button onClick={handleCreateClick} id="create-btn" style={{ color:'white'}}>""Create Account""</Button>

        <Button onClick={()=>{navigate('/')}} style={{width:185,backgroundColor:'grey', color:'white'}}>Have an account? click here to login</Button>
        </div>
        
    </div>
  )
}

export default Register