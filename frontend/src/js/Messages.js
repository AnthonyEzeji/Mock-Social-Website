import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-admin'
import { Navigate, useNavigate, useParams } from 'react-router'
import '../css/FriendsList.css'
import {db} from './Firebase'
import {query,where, onSnapshot, collection, addDoc, getDocs, orderBy } from "firebase/firestore";

function Messages() {

    var otherUsersId = []
    var uniqueIds = []
    var params = useParams()
    
    
    var navigate = useNavigate()
    const [messages, setMessages] = useState([])
    const [messagesList, setMessagesList] = useState([])
    var arr = []
    var objectToPush = []
    var data = {}
    var messagesArr = []
  
    var tempArr = []
    var currUser = {}
    useEffect(() => {
        
            async function getMessages(){
         
                function compareMessages(currentElement){
                   
                     if(currentElement.data().sentTo==JSON.parse(window.sessionStorage.getItem('session')).user.id||currentElement.data().sentFrom==JSON.parse(window.sessionStorage.getItem('session')).user.id){   
                         return true
                     }
                 
                 }
                 function compareTime( a, b )
                 {
                 if ( a.createdAt < b.createdAt){
                   return -1;
                 }
                 if ( a.createdAt > b.createdAt){
                   return 1;
                 }
                 return 0;
               }
                var currRec = JSON.parse(window.sessionStorage.getItem('currRec'))
                const messagesRef = collection(db, "messages");
                
                const q = query(messagesRef, orderBy("createdAt", "desc"));
                const unsubscribe = await onSnapshot(q,snapshot=>{
                    console.log(snapshot.docs)
                    setMessages(snapshot.docs.sort(compareTime).filter(compareMessages).map(doc=>{return doc.data()})) 
                })
               
            }
       
       
            return () => {
                getMessages()
              }
   
      
     
    }, [])

    useEffect(() => {
  console.log(messages)
       tempArr = []
       
       messages.forEach(doc=>{
           var data = doc
           if(data.sentFrom == JSON.parse(window.sessionStorage.getItem('session') ).user.id){
               tempArr.push(data.sentTo)
               
           }else{
               tempArr.push(data.sentFrom)
           }
       })
    var newSet = [...new Set(tempArr)]
   
        newSet.forEach(async id=>{
            var userMessages = []
            currUser = {}
            await axios.get(`http://3.92.186.223:5000/api/users/2/${id}`).then(res=>{
               currUser = res.data
                console.log(res.data)
            })
            messages.forEach(doc=>{
                
                if(doc.sentTo == id||doc.sentFrom==id){
                    
                    userMessages.push(doc)
                   
                }
            })
           
          arr.push({data:userMessages, currUser})
          setMessagesList(arr.map((doc)=>doc))
        })

    
      return () => {
        
      }
    }, [messages])
    
 
 
    async function handleMessageClick(e){
        console.log(messagesList)
for(var i = 0 ; i < messagesList.length;i++){


    if(messagesList[i].currUser.userName == e.target.parentNode.firstChild.innerText ){
    
        await axios.get(`http://3.92.186.223:5000/api/users/${e.target.parentNode.firstChild.innerText.toString()}`).then(res=>{
            window.sessionStorage.setItem('currRec', JSON.stringify(res.data))
        })
        navigate(`/chat/${e.target.parentNode.firstChild.innerText.toString()}`)
    }
}
    }
  return (
    <div className='messages'>
    <h3>Messages</h3>
    <ul className='item-container'>
        {messagesList.map((obj,index)=>{
            
            
            
            return (
            <li onClick={(e)=>handleMessageClick(e)} key={index} className='friends-list-item'>
                <h5>{obj.currUser.userName}</h5>
                <p>{obj.data[0].text}</p>
            </li>
            )
        })}

    </ul>

</div>

  )
}

export default Messages