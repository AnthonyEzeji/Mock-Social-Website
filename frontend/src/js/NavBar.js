import { Avatar, Button, } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Drawer from './drawer'
import '../css/NavBar.css'
import { db, storage } from './Firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'
function NavBar() {
  const [userFirestore, setUserFirestore] = useState({})
  useEffect(() => {
    async function getSesisonUserInfo(){
        const q = query(collection(db,'users'), where("userName", "==", `${JSON.parse(window.sessionStorage.getItem('session')).user.userName}` ))
          onSnapshot(q,snapshot=>{
              
             
                  setUserFirestore( snapshot.docs[0].data())
              
          })
         
    }
   


  return () => {
    getSesisonUserInfo()
  }
}, [])
const [avatar, setAvatar] = useState('')

  var navigate = useNavigate()
  function handleLogoutClick(){
      window.sessionStorage.setItem('session',null)
      window.sessionStorage.setItem('currRec',null)
      navigate('/')
  }
  function handleProfileClick(){
   
    
    navigate(`/profile/${JSON.parse(window.sessionStorage.getItem('session')).user._id}`)
}
  return (
   
    <div className='navbar'>
         <Drawer></Drawer>
        <Button  className='nav-btn' style={{color:'white'}} onClick={handleLogoutClick} id= 'navbar-btn'>Log Out</Button>
        <Button  className='nav-btn' onClick={handleProfileClick} id= 'navbar-btn'><Avatar src={userFirestore.avatar}></Avatar></Button>
       
    </div>
  )
}

export default NavBar