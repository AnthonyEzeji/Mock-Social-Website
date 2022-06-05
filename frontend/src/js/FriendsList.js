import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useRedirect } from 'react-admin'
import { useNavigate, useParams } from 'react-router'
import '../css/FriendsList.css'

function FriendsList() {
    var params = useParams()
    var redirect = useRedirect()
  
    
    var user = {}
    var navigate = useNavigate()
    const [friendsList, setFriendsList] = useState([])
    useEffect(() => {

    async function getFriends(){
        await axios.get(`https://localhost:5000/api/friends/${params._id}`).then(res=>{
            setFriendsList(res.data)
        })
    }
    getFriends()
    }, [params])
    async function handleFriendClick(e){
        
        await axios.get(`https://localhost:5000/api/users/${e.target.innerText}`).then(res=>{
            navigate(`/profile/${res.data._id}`)
        })
    }
  return (
    <div className='friends-list'>
        <h3>Friends</h3>
        <ul className='item-container'>
        {friendsList.map((friend,index)=>{
            return(<li key={index} onClick = {(e)=>handleFriendClick(e)}className='friends-list-item'>
                <p>{friend.userName}</p>
            </li>)
        })}
        </ul>

    </div>
  )
}

export default FriendsList