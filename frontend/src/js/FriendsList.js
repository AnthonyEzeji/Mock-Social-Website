import { Autocomplete, Button, colors, Input, TextField } from '@mui/material'
import axios from 'axios'
import { doc,addDoc, collection, deleteDoc, getDoc, onSnapshot, serverTimestamp } from 'firebase/firestore'

import React, { useEffect, useState } from 'react'
import { useRedirect } from 'react-admin'
import { useNavigate, useParams } from 'react-router'
import '../css/FriendsList.css'
import { db } from './Firebase'

function FriendsList() {
    const [friendRequests, setFriendRequests] = useState([])
    
    
    var params = useParams()
    var redirect = useRedirect()
  const [users, setUsers] = useState([])
    var arr = []
    var user = {}

    var navigate = useNavigate()
    const [friendsList, setFriendsList] = useState([])
    const [friendRequestsToDisplay, setFriendRequestsToDisplay] = useState([])
    const [value, setValue] = React.useState();
  const [inputValue, setInputValue] = React.useState('');
    useEffect(() => {
        function compareId(currentElement){
            console.log(currentElement.data())
            if(currentElement.data().from ==JSON.parse(window.sessionStorage.getItem('session')).user.userName||currentElement.data().to ==JSON.parse(window.sessionStorage.getItem('session')).user.userName){
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
                
               if(request.to ==  JSON.parse(window.sessionStorage.getItem('session')).user.userName){
                 await axios.get(`https://localhost:5000/api/users/2/${request.from}`).then(res=>{
                    tempArr.push({request,user:res.data}) 
                   
                })
                   
               }else{
                await axios.get(`https://localhost:5000/api/users/2/${request.to}`).then(res=>{
                    tempArr.push({request,user:res.data}) 
                    
                })
                   
               }
               setFriendRequestsToDisplay(tempArr)
            })
          return () => {
            
          }
        }, [friendRequests])
        console.log(friendRequestsToDisplay)
    async function handleFriendClick(e){

        await axios.get(`https://localhost:5000/api/users/${e.target.parentNode.parentNode.firstChild.innerText}`).then(res=>{
            navigate(`/profile/${res.data._id}`)
        })
       
    }
    async function onAcceptClick(e){
        console.log(e.target.id)
        console.log(JSON.parse(window.sessionStorage.getItem('session')).user.userName)
        const friendsRef = collection(db, "friends")
        await addDoc(friendsRef, {user1:JSON.parse(window.sessionStorage.getItem('session')).user.userName, user2:e.target.id, createdAt:serverTimestamp()})
        const friendRequestRef = collection(db, "friendRequests")
        var docToGet = {}
        onSnapshot(friendRequestRef, snapshot=>{
            
            snapshot.docs.forEach(async doc1=>{
                if((doc1.data().to == e.target.id && doc1.data().from == JSON.parse(window.sessionStorage.getItem('session')).user.userName)||(doc1.data().to == JSON.parse(window.sessionStorage.getItem('session')).user.userName && doc1.data().from == e.target.id )){
                    deleteDoc(doc(friendRequestRef,doc1.id))
                }
                
                
                
            })
        })
       
        
    }
    function onDeclineClick(e){
        console.log(e.target.id)
        console.log(JSON.parse(window.sessionStorage.getItem('session')).user.userName)
        const friendRequestRef = collection(db, "friendRequests")
        var docToGet = {}
        onSnapshot(friendRequestRef, snapshot=>{
            snapshot.docs.forEach(async doc1=>{
                if((doc1.data().to == e.target.id && doc1.data().from == JSON.parse(window.sessionStorage.getItem('session')).user.userName)||(doc1.data().to == JSON.parse(window.sessionStorage.getItem('session')).user.userName && doc1.data().from == e.target.id )){
                    deleteDoc(doc(friendRequestRef,doc1.id))
                }
                
                
                
            })
        })
    }
    useEffect(() => {
      const usersRef= collection(db, 'users')
    onSnapshot(usersRef, snapshot=>{
        setUsers(snapshot.docs.map(doc=>{
            return {label:doc.data().userName, avatar:doc.data().avatar}
        }))
    })
      return () => {
        
      }
    }, [])
  const [bool, setBool] = useState(true);
    function handleAddClick(e){
        setBool(true)
        var counter = 0;
        var counter2 = 0
        var tempArr = []
        if(inputValue.length>0){
            
            if(inputValue ==JSON.parse(window.sessionStorage.getItem('session')).user.userName  ){
                alert("Cannot add yourself as a friend! Try again!")
            }
            else{
                if(friendsList.length>0){
                    friendsList.forEach(friend=>{
                        console.log(friend)
                        if(friend.user2 == JSON.parse(window.sessionStorage.getItem('session')).user.userName){
                            if(friend.user1 != inputValue&&counter<1 ){
                                console.log('hit')
                                counter = counter+1
                                const friendRequestsRef = collection(db, "friendRequests")
                                addDoc(friendRequestsRef, {to: inputValue, from:JSON.parse(window.sessionStorage.getItem('session')).user.userName})
                            }else if(friend.user1==inputValue&& counter<1){
                                counter = counter+1
                                alert('account selected is already a friend')
                            }
                        }else if(friend.user1 == JSON.parse(window.sessionStorage.getItem('session')).user.userName){
                            if(friend.user2 != inputValue&&counter<1 ){
                                counter = counter+1
                                const friendRequestsRef = collection(db, "friendRequests")
                                addDoc(friendRequestsRef, {to: inputValue, from:JSON.parse(window.sessionStorage.getItem('session')).user.userName})
                            }else if(friend.user2 == inputValue&&counter<1 ){
                                counter = counter+1
                                alert('account selected is already a friend')
                            }
    
                        }
                        
                        
                    })
                }else{
                    console.log('hello')
                    function compareRequest(currentElement){
                        if((currentElement.data().to == inputValue&&currentElement.data().from == JSON.parse(window.sessionStorage.getItem('session')).user.userName)||(currentElement.data().from== inputValue&&currentElement.data().to == JSON.parse(window.sessionStorage.getItem('session')).user.userName)){
                            return true

                        }else{return false}
                    }
                    const friendRequestsRef = collection(db, "friendRequests")
                    onSnapshot(friendRequestsRef, snapshot=>{
                        snapshot.docs.filter(compareRequest).forEach(doc=>{
                            tempArr.push(doc)
                            console.log(tempArr.length)
                        })
                        if(tempArr.length>0){
                            tempArr.forEach(request=>{
                                
                                if((request.data().to == inputValue && request.data().from ==JSON.parse(window.sessionStorage.getItem('session')).user.userName )||(request.data().from == inputValue && request.data().to ==JSON.parse(window.sessionStorage.getItem('session')).user.userName )){
                                    return 
                                }else{
                                    addDoc(friendRequestsRef, {to: inputValue, from:JSON.parse(window.sessionStorage.getItem('session')).user.userName})
                                }
                            })
                        }else{
                            addDoc(friendRequestsRef, {to: inputValue, from:JSON.parse(window.sessionStorage.getItem('session')).user.userName})
                        }
                    
                    })
                    
                  
                   
                }
                console.log(friendsList)
                

            }
           
        }
        else{
            return false
        }
       
        

    }
    console.log(friendRequests)
    function handleDeleteFriendClick(e){
        console.log(e.target.id)
    }
  return (
    <div className='friends-list'>
        <h3>Friends</h3>
        <ul className='item-container'>
            <div style={{width:'100%', height:"fit-content"}}>
            <Autocomplete
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        id="controllable-states-demo"
        options={users}
        sx={{ width: "100%"}}
        renderInput={(params) => <TextField {...params} label="Add Friends" />}
      />
      <Button style={{backgroundColor:'grey', color:'white',margin: 5}} onClick={(e)=>handleAddClick(e)}>Add</Button>
            </div>
            {friendRequests.length>0?friendRequests.map(request=>{
                if(request.from == JSON.parse(window.sessionStorage.getItem('session')).user.userName ){
                    return(<div className = 'friend-requests'>
                    <p className='request-item-username'>REQUEST - {request.to}
                    </p>
                    <h5>PENDING</h5>
                    <Button id={request.to} onClick={(e)=>onDeclineClick(e)}  style={{backgroundColor:'grey', color:'white',margin: 5}}>Cancel</Button>
                    </div>)
                }else{
                    return(<div className = 'friend-requests'>
                    <p className='request-item-username'>REQUEST - {request.from}
                    </p>
                    <Button id={request.from} onClick={(e)=>onAcceptClick(e)} style={{backgroundColor:'green', color:'white',}}>Accept</Button>
                    <Button id={request.from} onClick={(e)=>onDeclineClick(e)} style={{backgroundColor:'red', color:'white',margin: 5}}>Decline</Button>
                    </div>)
                }
                
            }):<></>}
        {friendsList.map((friend,index)=>{
            if(friend.user1 == JSON.parse(window.sessionStorage.getItem('session')).user.userName ){
                return(<li key={index} className='friends-list-item'>
                <p>{friend.user2}</p>
                <div> <Button style={{color:"black",backgroundColor:'grey', margin:5}} onClick = {(e)=>handleFriendClick(e)}>Profile</Button>
                <Button style={{color:"black",backgroundColor:'red', margin:5}} id={friend.user2} onClick={(e)=>handleDeleteFriendClick(e)}>Delete</Button></div>
               
            </li>)
            }else{
                return(<li key={index} onClick = {(e)=>handleFriendClick(e)}className='friends-list-item'>
                <p>{friend.user1}</p>
                <div>
                    <Button style={{color:"black",backgroundColor:'grey', margin:5}} onClick = {(e)=>handleFriendClick(e)}>Profile</Button>
                <Button style={{color:"black",backgroundColor:'red', margin:5}} id={friend.user1} onClick={(e)=>handleDeleteFriendClick(e)}>Delete</Button></div>
                
            </li>)
            }
           
        })}
        </ul>

    </div>
  )
}

export default FriendsList