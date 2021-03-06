import React, { useEffect, useState } from 'react'
import '../css/Login.css'
import {Button, TextField} from '@mui/material'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import {useRedirect} from 'react-admin'
function Login() {
   
    var redirect = useRedirect()
    var navigate = useNavigate()
    useEffect( () => {
        async function getLoginAuth(){
            if(window.sessionStorage.hasOwnProperty('session')){
                if( window.sessionStorage.getItem('session')!=null){
                  await axios.post('http://3.92.186.223:5000/api/login', {userName : JSON.parse(window.sessionStorage.getItem('session')).user.userName, password:JSON.parse(window.sessionStorage.getItem('session')).user.password}).then(res=>{
                  
                    if(res.data.isAuth){
                      
            window.sessionStorage.setItem('session', JSON.stringify(res.data));
            
                      
                      
                      navigate(`/profile/${res.data.user._id}`)
                      
                       
                     
                    }
            
                  })
                }
              }

        }
        return ()=>{
          getLoginAuth()
        }
   
       
      }, [])
    const [credentials, setCredentials] = useState({userName:'',password:''})
useEffect(() => {

}, [credentials]);
  function handleUserNameChange(e){
      setCredentials({userName:e.target.value,password:credentials.password})
  }
  function handlePasswordChange(e){
    setCredentials({userName:credentials.userName,password:e.target.value})
}
    async function handleLoginClick(e){
await axios.post('http://3.92.186.223:5000/api/login',credentials).then(res=>{
    
    if(res.data.hasOwnProperty('isAuth')){
        if(res.data.isAuth){
            window.sessionStorage.setItem('session',JSON.stringify(res.data))
           
            redirect(`/profile/${JSON.parse(window.sessionStorage.getItem('session')).user._id}`)
        }
    }else if(res.data.hasOwnProperty('message')){
        alert(res.data.message)
    }
})
    }
  return (
    <div className='login'>
        <div className="login-form">
            <h5>
            Username
            </h5>
            <TextField  onChange= {(e)=>handleUserNameChange(e)} ></TextField>
            <h5>
             Password
            </h5>
            <TextField onChange= {(e)=>handlePasswordChange(e)}  type="password"></TextField>
            <Button style={{color:'black',backgroundColor:"gold", margin:10, width:225}} onClick={(e)=>handleLoginClick(e)}>Login</Button>

            <p>
                Don't have an account? <Link style={{color:'white'}} to='/register'>Register.</Link>
            </p>
            
        </div>
    </div>
  )
}

export default Login