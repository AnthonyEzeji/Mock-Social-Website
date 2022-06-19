import { Autocomplete, Avatar, Button, colors, Input, TextField } from '@mui/material'
import axios from 'axios'
import { doc,addDoc, collection, deleteDoc, getDoc, onSnapshot, serverTimestamp, query, where } from 'firebase/firestore'
import { getDownloadURL, ref } from 'firebase/storage'

import React, { useEffect, useState } from 'react'
import { useRedirect } from 'react-admin'
import { useNavigate, useParams } from 'react-router'
import '../css/FriendsList.css'
import { db, storage } from './Firebase'

function FriendsList() {
    const [friendRequests, setFriendRequests] = useState([])
    
    
    var params = useParams()
    var redirect = useRedirect()
  const [users, setUsers] = useState([])
    var arr = []
    var user = {}
    const [open, setOpen] = useState(false)
    const [friendsListToDisplay, setFriendsListToDisplay] = useState([])
    var navigate = useNavigate()
    const [friendsList, setFriendsList] = useState([])
   
    const [friendRequestsToDisplay, setFriendRequestsToDisplay] = useState([])
    const [value, setValue] = React.useState();
  const [inputValue, setInputValue] = React.useState('');
  const [friendsFirestore, setFriendsFirestore] = useState([])

    useEffect(() => {
        function compareId(currentElement){
          
            if(currentElement.data().from ==JSON.parse(window.sessionStorage.getItem('session')).user.userName||currentElement.data().to ==JSON.parse(window.sessionStorage.getItem('session')).user.userName){
       
                return true
            }
        }
        
      onSnapshot(collection(db,'friendRequests'),snapshot=>{
         
           setFriendRequests(snapshot.docs.filter(compareId).map(doc=>{return doc.data()}))
         
      })
    
      return () => {
      
      }
    }, [])
 
    useEffect(() => {
        
        
        
            
            const friendsRef = collection(db, 'friends')
          const unsub = onSnapshot(friendsRef,snapshot=>{
              arr=[]
              snapshot.docs.forEach(doc=>{
                  
                  if(doc.data().user1 == JSON.parse(window.sessionStorage.getItem('session')).user.userName||doc.data().user2 == JSON.parse(window.sessionStorage.getItem('session')).user.userName){
                    if(doc.data().user1 == JSON.parse(window.sessionStorage.getItem('session')).user.userName){
                      arr.push(doc.data().user2)
                    }else if(doc.data().user2 == JSON.parse(window.sessionStorage.getItem('session')).user.userName){
                       arr.push(doc.data().user1)
                    }
                  
                    
                  }
              })
              
              
              setFriendsList(arr)
          })
         
          
          
        return ()=>{
unsub()
        }
       
        }, [params])

     
       console.log(friendsList) 
       
       useEffect(() => {
       
        var url = ""
        async function getFriendsFirestore(){
            var arr4 = []
            friendsList.forEach(friend=>{
                console.log(friend)
                const q = query(collection(db,'users'), where("userName", '==', friend))
                onSnapshot(q,async snapshot=>{
                    console.log(snapshot.docs)
                    var tempUserInfo ={}
                     snapshot.docs.forEach(doc=>{
                        console.log(doc.data())
                         arr4.push(doc.data())
                        
                        console.log(arr4)
                        console.log(friendsList)
                        if(arr4.length == friendsList.length){
                          
                            setFriendsFirestore(arr4.map((friend)=>{
                                return friend
                            }))
                        }
                     })
                  
                })
               
            })
            
                
        }
        getFriendsFirestore()
          }, [friendsList])
         
          console.log(friendsFirestore)

        


        useEffect(() => {
          var tempArr = []
            friendRequests.forEach(async  (request)=>{
              
                
               if(request.to ==  JSON.parse(window.sessionStorage.getItem('session')).user.userName){
                 await axios.get(`http://3.92.186.223:5000/api/users/2/${request.from}`).then(res=>{
                    tempArr.push({request,user:res.data}) 
                   
                })
                   
               }else{
                await axios.get(`http://3.92.186.223:5000/api/users/2/${request.to}`).then(res=>{
                    tempArr.push({request,user:res.data}) 
                    
                })
                   
               }
               setFriendRequestsToDisplay(tempArr)
            })
          return () => {
            
          }
        }, [friendRequests])
        
    async function handleFriendClick(e){

        await axios.get(`http://3.92.186.223:5000/api/users/${e.target.parentNode.parentNode.firstChild.innerText}`).then(res=>{
            navigate(`/profile/${res.data._id}`)
        })
       
    }
    async function onAcceptClick(e){
   
       
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



  function compareRequest(currentElement){
    if((currentElement.data().to == inputValue&&currentElement.data().from == JSON.parse(window.sessionStorage.getItem('session')).user.userName)||(currentElement.data().from== inputValue&&currentElement.data().to == JSON.parse(window.sessionStorage.getItem('session')).user.userName)){
        return true

    }else{return false}
}
    async function handleAddClick(e){
        var counter =0
        var boolean = true
        
        var tempArr = []
        if(inputValue.length>0){
            if(friendsList.length == 0 && friendRequests.length == 0){
                const friendRequestsRef = collection(db, "friendRequests")
             
                await addDoc(friendRequestsRef, {to: inputValue, from:JSON.parse(window.sessionStorage.getItem('session')).user.userName})
            }else if(friendsList.length != 0 && friendRequests.length == 0){
                
                friendsList.forEach(friend=>{
               console.log(counter)
                    console.log(friend)
                    
                        console.log(inputValue)
                        if(friend == inputValue ){
                            boolean = false
                          
                         
                        }else{
                            boolean = boolean
                        }
                    
                    
                    
                })
                if(boolean){
                    
                        const friendRequestsRef = collection(db, "friendRequests")
                        console.log(counter)
                         counter=counter+1
                        
                         console.log(3)
                          addDoc(friendRequestsRef, {to: inputValue, from:JSON.parse(window.sessionStorage.getItem('session')).user.userName})
                    
                }

            }else if(friendRequests!=0 && friendsList.length == 0){
                friendRequests.forEach(request=>{
                    if((request.to == inputValue && request.from ==JSON.parse(window.sessionStorage.getItem('session')).user.userName )||(request.from == inputValue && request.to ==JSON.parse(window.sessionStorage.getItem('session')).user.userName )){         
                        if(counter<1){
                            counter=counter+1
                           alert('request already sent')
                     
                        }else{
                            return
                        }
                        
                    }else {
                        if(counter<1){
                            
                            counter=counter+1
                            const friendRequestsRef = collection(db, "friendRequests")
                            addDoc(friendRequestsRef, {to: inputValue, from:JSON.parse(window.sessionStorage.getItem('session')).user.userName})
                        }else{return}
                       
                    }
                })

            }
        
        }
        else{
            return false
        }
       
        

    }
   
    function handleDeleteFriendClick(e){
        console.log(e.target.id)
        console.log(JSON.parse(window.sessionStorage.getItem('session')).user.userName)
        const friendsRef = collection(db, "friends")
        onSnapshot(friendsRef, snapshot=>{
            snapshot.docs.forEach(async doc1=>{
                if((doc1.data().user1 == e.target.id && doc1.data().user2 == JSON.parse(window.sessionStorage.getItem('session')).user.userName)||(doc1.data().user1 == JSON.parse(window.sessionStorage.getItem('session')).user.userName && doc1.data().user2 == e.target.id )){
                    deleteDoc(doc(friendsRef,doc1.id))
                }
                
                
                
            })
        })
   
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
        open={open}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
            if (newInputValue.length === 0) {
                if (open) setOpen(false);
              } else {
                if (!open) setOpen(true);
              }
          
        }}
        onClose={() => setOpen(false)}
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
        {friendsFirestore.map((obj,index)=>{
            return(<li key={index} className='friends-list-item'>
                <div style = {{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:'center',marginTop:5}}>
                    <Avatar style ={{marginRight:5}} src = {obj.avatar}></Avatar>
                <p>{obj.userName}</p>
                
                </div>
            
            <div> <Button style={{color:"black",backgroundColor:'grey', margin:5}} onClick = {(e)=>handleFriendClick(e)}>Profile</Button>
            <Button id={obj.userName} style={{color:"black",backgroundColor:'rgb(54, 20, 20)',color:"white", margin:5}}  onClick={(e)=>handleDeleteFriendClick(e)}>Delete</Button></div>
           
        </li>)
        })}
        </ul>

    </div>
  )
}

export default FriendsList