import { Input } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Button } from '@mui/material'
import { useParams } from 'react-router'
import axios from 'axios'
import '../css/ChatScreen.css'
function 
ChatScreen() {
    var params = useParams()
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        async function getChat(){
          
           await axios.get(`https://localhost:5000/api/messages/${JSON.parse(window.sessionStorage.getItem('session')).user._id}/${window.sessionStorage.getItem('curr-recipient')}`).then(res=>{
              setMessages(res.data)
           })

        }
        getChat()
    
    }, [])
    console.log(messages)

  return (
    <div className='chat-screen'>
        <div className='chat-display'>
            {messages.map((message,index)=>{
             
                if(message.sentFrom == JSON.parse(window.sessionStorage.getItem('session')).user.id ){
                    return(<div key = {index} className = 'sent-from'>
                       <p>{message.text}</p>
                    </div>)
                }else if(message.sentTo == JSON.parse(window.sessionStorage.getItem('session')).user.id ){
                    return(<div key = {index}  className = 'sent-to'>
                    <p>{message.text}</p>
                </div>)
                }
                
            })}
        </div>
        <Input id= "chat-input">

        </Input>
       <Button id = "chat-send-btn">click me</Button>
    </div>
  )
}

export default ChatScreen
