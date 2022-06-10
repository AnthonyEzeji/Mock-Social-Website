import { Avatar, Button, } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import Drawer from './drawer'
import '../css/NavBar.css'
import { db } from './Firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
function NavBar() {
  const [userFirestore, setUserFirestore] = useState({})
  useEffect(() => {
    async function getSesisonUserInfo(){
        const q = query(collection(db,'users'), where("userName", "==", `${JSON.parse(window.sessionStorage.getItem('session')).user.userName}` ))
          onSnapshot(q,snapshot=>{
              console.log(snapshot.docs)
              snapshot.forEach(doc=>{
                  setUserFirestore(doc.data())
              })
          })
         
    }
   


  return () => {
    getSesisonUserInfo()
  }
}, [])
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
        <Button onClick={handleLogoutClick} id= 'navbar-btn'>Log Out</Button>
        <Button onClick={handleProfileClick} id= 'navbar-btn'><Avatar src={userFirestore.avatar}></Avatar></Button>
       
    </div>
  )
}

export default NavBar