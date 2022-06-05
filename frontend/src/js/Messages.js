import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Button } from 'react-admin'
import { Navigate, useNavigate, useParams } from 'react-router'
import '../css/FriendsList.css'
function Messages() {

    var params = useParams()
    var navigate = useNavigate()
    const [messages, setMessages] = useState([])
    useEffect(() => {

    async function getMessages(){
    await axios.get(`https://localhost:5000/api/messages/${JSON.parse(window.sessionStorage.getItem('session')).user._id}`).then(res=>{
        setMessages(res.data)
        
    })
    }
    getMessages()
    }, [])
    async function handleMessageClick(e){
for(var i = 0 ; i < messages.length;i++){


    if(messages[i].otherUser.userName == e.target.parentNode.firstChild.innerText ){
        window.sessionStorage.setItem('curr-recipient',e.target.parentNode.firstChild.innerText.toString() )
        navigate(`/chat/${window.sessionStorage.getItem('curr-recipient')}`)
    }
}
    }
  return (
    <div className='messages'>
    <h3>Messages</h3>
    <ul className='item-container'>
        {messages.map((obj,index)=>{
            var date = new Date(obj.messages[obj.messages.length-1].createdAt)
            
            return (
            <li key={index} className='friends-list-item'>
                <h5>{obj.otherUser.userName}</h5>
                <p>{obj.messages[obj.messages.length-1].text}</p>
                <p>{date.getUTCHours().toString()+':'+date.getUTCMinutes().toString()+'-'+date.getUTCMonth()+'/'+date.getUTCDate()+'/'+date.getUTCFullYear().toString().split('0')[1]}</p>
               <button onClick= {(e)=>handleMessageClick(e)}>click</button>
            </li>
            )
        })}

    </ul>

</div>

  )
}

export default Messages