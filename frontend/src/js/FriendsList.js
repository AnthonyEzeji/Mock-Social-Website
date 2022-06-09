import axios from 'axios'
import { collection, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useRedirect } from 'react-admin'
import { useNavigate, useParams } from 'react-router'
import '../css/FriendsList.css'
import { db } from './Firebase'

function FriendsList() {
    var params = useParams()
    var redirect = useRedirect()
  
    var arr = []
    var user = {}
    var navigate = useNavigate()
    const [friendsList, setFriendsList] = useState([])
    useEffect(() => {
        
        
        async function getFriends(){
            
            const friendsRef = collection(db, 'friends')
          const unsub = onSnapshot(friendsRef,snapshot=>{
              arr=[]
              snapshot.docs.forEach(doc=>{
                  
                  if(doc.data().user1 == JSON.parse(window.sessionStorage.getItem('session')).user.userName||doc.data().user2 == JSON.parse(window.sessionStorage.getItem('session')).user.userName){
                    arr.push(doc.data())
                    
                  }
              })
              unsub()
              
              setFriendsList(arr)
          })
          
          
        }
        getFriends()
        }, [params])
        useEffect(() => {
        
        }, [])
        
        
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
            if(friend.user1 == JSON.parse(window.sessionStorage.getItem('session')).user.userName ){
                return(<li key={index} onClick = {(e)=>handleFriendClick(e)}className='friends-list-item'>
                <p>{friend.user2}</p>
            </li>)
            }else{
                return(<li key={index} onClick = {(e)=>handleFriendClick(e)}className='friends-list-item'>
                <p>{friend.user1}</p>
            </li>)
            }
           
        })}
        </ul>

    </div>
  )
}

export default FriendsList