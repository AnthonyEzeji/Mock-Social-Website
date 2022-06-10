import { Button } from '@mui/material'
import axios from 'axios'
import { collection, onSnapshot } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useRedirect } from 'react-admin'
import { useNavigate, useParams } from 'react-router'
import '../css/FriendsList.css'
import { db } from './Firebase'

function FriendsList() {
    const [friendRequests, setFriendRequests] = useState([])
    
    
    var params = useParams()
    var redirect = useRedirect()
  
    var arr = []
    var user = {}
    var tempArr = []
    var navigate = useNavigate()
    const [friendsList, setFriendsList] = useState([])
    const [userNames, setUserName] = useState([])
    useEffect(() => {
        function compareId(currentElement){
            console.log(currentElement.data())
            if(currentElement.data().from ==JSON.parse(window.sessionStorage.getItem('session')).user.id||currentElement.data().to ==JSON.parse(window.sessionStorage.getItem('session')).user.id){
                console.log(true)
                return true
            }
        }
        
      onSnapshot(collection(db,'friendRequests'),snapshot=>{
          console.log(snapshot.docs)
           setFriendRequests(snapshot.docs.filter(compareId).map(doc=>{return doc.data()}))
         
      })
    
      return () => {
      
      }
    }, [])
    console.log(friendRequests)
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
        
        useEffect(() => {
          var tempArr = []
            friendRequests.forEach(async  (request)=>{
                console.log(request)
                
               if(request.to ==  JSON.parse(window.sessionStorage.getItem('session')).user.id){
                 await axios.get(`https://localhost:5000/api/users/2/${request.from}`).then(res=>{
                    tempArr.push(res.data.userName) 
                   
                })
                   
               }else{
                await axios.get(`https://localhost:5000/api/users/2/${request.to}`).then(res=>{
                    tempArr.push(res.data.userName) 
                    
                })
                   
               }
               setUserName(tempArr)
            })
          return () => {
            
          }
        }, [friendRequests])
        console.log(userNames)
    async function handleFriendClick(e){
        
        await axios.get(`https://localhost:5000/api/users/${e.target.innerText}`).then(res=>{
            navigate(`/profile/${res.data._id}`)
        })
    }
  return (
    <div className='friends-list'>
        <h3>Friends</h3>
        <ul className='item-container'>
            {userNames.map(userName=>{
                return(<div className = 'friend-requests'>
                    <p className='request-item-username'>REQUEST - {userName}
                    </p>
                    <Button style={{backgroundColor:'green', color:'white', margin: 5}}>Accept</Button>
                    <Button style={{backgroundColor:'red', color:'white',margin: 5}}>Decline</Button>
                    </div>)
            })}
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