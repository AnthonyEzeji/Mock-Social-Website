import axios from 'axios'
import React, { useEffect, useState } from 'react'
import '../css/FriendsList.css'

function FriendsList() {
    var user = {}
    const [friendsList, setFriendsList] = useState([])
    useEffect(() => {
user = JSON.parse(window.sessionStorage.getItem('session')).user
    async function getFriends(){
        await axios.get(`https://localhost:5000/api/friends/${user.id}`).then(res=>{
            setFriendsList(res.data)
        })
    }
    getFriends()
    }, [])
    async function handleFriendClick(e){
        
        await axios.get(`https://localhost:5000/api/users/${e.target.innerText}`).then(res=>{
            console.log(res.data)
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