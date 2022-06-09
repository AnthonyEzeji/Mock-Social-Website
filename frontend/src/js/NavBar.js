import { Button, } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router'
import '../css/NavBar.css'
function NavBar() {
  var navigate = useNavigate()
  function handleLogoutClick(){
      window.sessionStorage.setItem('session',null)
      window.sessionStorage.setItem('currRec',null)
      navigate('/')
  }
  return (
   
    <div className='navbar'>
        
        <Button onClick={handleLogoutClick} id= 'navbar-btn'>Log Out</Button>

    </div>
  )
}

export default NavBar