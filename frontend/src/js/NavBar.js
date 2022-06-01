import { Button, } from '@mui/material'
import React from 'react'
import '../css/NavBar.css'
function NavBar() {
  return (
    <div className='navbar'>
        <Button id= 'navbar-btn'>Messages</Button>
        <Button id= 'navbar-btn'>Log Out</Button>

    </div>
  )
}

export default NavBar