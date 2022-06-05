import { Avatar } from '@mui/material'
import axios from 'axios';

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import '../css/Card.css'
function Card() {
  var params = useParams()
    const [user, setUser] = useState({});
    useEffect(() => {
        async function getCardInfo(){
          await axios.get(`https://localhost:5000/api/users/1/${params._id}`).then(res=>{
            console.log(res.data)
            setUser(res.data)
          })
        }
        getCardInfo()
    }, [params])
    console.log(user)
    
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