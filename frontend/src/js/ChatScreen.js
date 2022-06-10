import { Input } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { useParams } from 'react-router'
import axios from 'axios'
import '../css/ChatScreen.css'
import {db}from './Firebase'

import {serverTimestamp,addDoc, doc, setDoc , collection, getDocs, onSnapshot, query, where, orderBy} from 'firebase/firestore'
import NavBar from './NavBar'
function
ChatScreen() {
    var params = useParams()
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('')
  
 
    
    useEffect(() => {
        async function getRecipient(){
        
        }
        return () => {
            getRecipient()
        };
    }, []);
    
    const messagesRef2 = collection(db, "messages");
  
    
    useEffect(() => {
      
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

function compareMessages(currentElement){
   var currRec = JSON.parse(window.sessionStorage.getItem('currRec'))
 
    if((currentElement.data().sentTo==JSON.parse(window.sessionStorage.getItem('session')).user.id&&currentElement.data().sentFrom==JSON.parse(window.sessionStorage.getItem('currRec')).id)||(currentElement.data().sentFrom==JSON.parse(window.sessionStorage.getItem('session')).user.id&&currentElement.data().sentTo==JSON.parse(window.sessionStorage.getItem('currRec')).id)){   
        return true
    }
   
   

}
        async function getMessages(){
            var currRec = JSON.parse(window.sessionStorage.getItem('currRec'))
            const messagesRef = collection(db, "messages");
            
            const q = query(messagesRef, orderBy("createdAt", "desc"));
            const unsubscribe = await onSnapshot(q,snapshot=>{
                setMessages(snapshot.docs.sort(compareTime).filter(compareMessages).map(doc=>{return doc.data()})) 
            })
            

           
            
             
               
            
          
            
            
          
            
        }
     
        return ()=>{
            getMessages()
        }

    }, [params])
   

 
async function handleSendClick(){
    document.getElementById('chat-input').value =null
    var currRec = JSON.parse(window.sessionStorage.getItem('currRec'))
    await addDoc(collection(db,'messages'), {
        createdAt:serverTimestamp(),
       text:input, sentTo:currRec.id, sentFrom:JSON.parse(window.sessionStorage.getItem('session')).user.id
      });
     
}
  return (
    <div className='chat-screen'>
        <NavBar></NavBar>
        <div className='chat-container'>
      
        <div className='chat-display'>
            {messages.map((message,index)=>{
          
             if(message.sentFrom == JSON.parse(window.sessionStorage.getItem('session')).user.id ){
                 if(message.createdAt!=null){
                   
                    var seconds = message.createdAt.seconds
                      var nanoseconds = message.createdAt.nanoseconds
                    const fireBaseTime = new Date(
                        seconds * 1000 + nanoseconds / 1000000,
                      );
                      const date = fireBaseTime.toDateString();
                      const atTime = fireBaseTime.toLocaleTimeString();
                      
                      return(<div key = {index} className = 'sent-from'>
                      <div className= 'sent-from-container'>
                      <p id = 'text'>{message.text}</p>
                      <p>{atTime}</p>
                     
                      </div>
                     
                     
                  </div>)
                 }
                
               
            }else if(message.sentTo == JSON.parse(window.sessionStorage.getItem('session')).user.id ){
                if(message.createdAt!=null){
               
                    var seconds = message.createdAt.seconds
                      var nanoseconds = message.createdAt.nanoseconds
                    const fireBaseTime = new Date(
                        seconds * 1000 + nanoseconds / 1000000,
                      );
                      const date = fireBaseTime.toDateString();
                      const atTime = fireBaseTime.toLocaleTimeString();
                      return(<div key = {index} className = 'sent-to'>
                      <div className= 'sent-to-container'>
                      <p id = 'text2'>{message.text}</p>
                      <p>{atTime}</p>
                     
                      </div>
                     
                     
                  </div>)
                 }
            }
               
                
            })}
        </div>
        <Input onChange={(e)=>setInput(e.target.value)} id= "chat-input">

        </Input>
       <Button onClick={input?handleSendClick:null} id = "chat-send-btn">send</Button>
        </div>
       
    </div>
  )
}

export default ChatScreen
