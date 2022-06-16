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
  const [temp, setTemp] = useState({})
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
    console.log('here3')
    console.log(JSON.parse(window.sessionStorage.getItem('currRec')))
   console.log(JSON.parse(window.sessionStorage.getItem('session')))
   console.log(currentElement.data())
      if((currentElement.data().sentTo==JSON.parse(window.sessionStorage.getItem('session')).user.id&&currentElement.data().sentFrom==JSON.parse(window.sessionStorage.getItem('currRec')).id)||(currentElement.data().sentFrom==JSON.parse(window.sessionStorage.getItem('session')).user.id&&currentElement.data().sentTo==JSON.parse(window.sessionStorage.getItem('currRec')).id)){   
          return true
      }else{return false}
     
     
  
  }
    
    useEffect(() => {
      
  console.log('here')
        async function getMessages(){
          console.log('here2')
            var currRec = JSON.parse(window.sessionStorage.getItem('currRec'))
            const messagesRef = collection(db, "messages");
            onSnapshot(messagesRef,orderBy("createdAt", "desc"), snapshot=>{
              snapshot.forEach(doc=>{
                console.log(doc.data())
              })
            })
            const q = query(messagesRef, orderBy("createdAt", "desc"));
  
            onSnapshot(q,snapshot=>{
              console.log(snapshot.docs)
                setMessages(snapshot.docs.filter(compareMessages).map(doc=>{return doc.data()})) 
            })
            

           
            
             
               
            
          
            
            
          
            
        }
     
      
            getMessages()
        

    }, [params])
   
console.log(messages)
 
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
                  
                  var currDate= new Date();
                  console.log(currDate.toLocaleDateString())
               
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
                      <p className="time" style={{margin:0,fontSize:10}}>{Math.floor(Math.abs(currDate-fireBaseTime)/ (1000 * 60 * 60 * 24))<1?atTime:null}</p>
                     <p className="time" style={{margin:0,fontSize:10}}>{Math.ceil(Math.abs(currDate-fireBaseTime)/ (1000 * 60 * 60 * 24))>1?date:null}</p>
                      </div>
                     
                     
                  </div>)
                 }
                
               
            }else if(message.sentTo == JSON.parse(window.sessionStorage.getItem('session')).user.id ){
                if(message.createdAt!=null){
                  var currDate= new Date();
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
                      <p className="time" style={{margin:0,fontSize:10}}>{Math.floor(Math.abs(currDate-fireBaseTime)/ (1000 * 60 * 60 * 24))<1?atTime:null}</p>
                     <p className="time" style={{margin:0,fontSize:10}}>{Math.ceil(Math.abs(currDate-fireBaseTime)/ (1000 * 60 * 60 * 24))>1?date:null}</p>
                     
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
