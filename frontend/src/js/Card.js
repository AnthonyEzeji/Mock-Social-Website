import { Avatar } from '@mui/material'
import React, { useEffect, useState } from 'react'
import '../css/Card.css'
function Card() {
    const [user, setUser] = useState({});
    useEffect(() => {
         setUser(JSON.parse(window.sessionStorage.getItem('session')).user) 
        
    }, [])
    
    
  return (
    <div className='card'>
        <div className="card-left">
            <Avatar id = 'avatar' />
            <h5>{user.userName}</h5>
        </div>
        <div className="bio">
            <h3>Bio</h3>
            <p>this is Anthony's bio. Blah blah blah blah blah blah blah blah</p>
        </div>
    </div>
  )
}

export default Card