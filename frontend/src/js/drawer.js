import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { useNavigate, useParams } from 'react-router';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import '../css/drawer.css'
import { db } from './Firebase';
import axios from 'axios';
import { ClickAwayListener, MenuItem, Select } from '@mui/material';

export default function TemporaryDrawer() {
  const [state, setState] = React.useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };
  var otherUsersId = []
  var uniqueIds = []
  var params = useParams()
  
  
  var navigate = useNavigate()
  const [messages, setMessages] = React.useState([])
  const [messagesList, setMessagesList] = useState([])
  const [currentFriendSelection, setCurrentFriendSelection] = useState('')
  var arr = []
  var objectToPush = []
  var data = {}
  var messagesArr = []
  var friendName =''
const [bool, setBool] = useState(false)
  var tempArr = []
  const [friends, setFriends] = useState([])
  var currUser = {}
useEffect(() => {
  console.log('hello')
  console.log(JSON.parse(window.sessionStorage.getItem('session')))
}, [])

      
      async function getCurrentFriendSelection(e){
          console.log(e.target.id)
          await axios.get(`https://3.92.186.223:5000/api/users/${e.target.id}`).then(res=>{
              window.sessionStorage.setItem('currRec',JSON.stringify(res.data))
              console.log(res.data)
          })
          navigate(`/chat/${e.target.id}`)
      }
   

  

  
  useEffect(() => {
      
      function compareFriends(currentElement){
          
          if(currentElement.data().user1 == JSON.parse(window.sessionStorage.getItem('session')).user.userName||currentElement.data().user2==JSON.parse(window.sessionStorage.getItem('session')).user.userName  ){
              
              return true
          }else{
           
              return false
          }
      }
 onSnapshot(collection(db,'friends'), snapshot=>{
     snapshot.docs.forEach(doc=>{
         
     })
      setFriends(snapshot.docs.filter(compareFriends).map(friend=>{
         
          if(friend.data().user1 == JSON.parse(window.sessionStorage.getItem('session')).user.userName ){
            return friend.data().user2
          }else{
              return friend.data().user1
          }
          
      }))
  })
  
   
  }, [])
 
  React.useEffect(() => {
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
              setMessages(snapshot.docs.sort(compareTime).filter(compareMessages).map(doc=>{return doc.data()})) 
          })
        
      }
      
 
    
    return () => {
      getMessages()
    }
  }, [])
console.log(messages)
  useEffect(() => {

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
          await axios.get(`https://3.92.186.223:5000/api/users/2/${id}`).then(res=>{
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
  
console.log(messagesList)

  async function handleMessageClick(e){
for(var i = 0 ; i < messagesList.length;i++){


  if(messagesList[i].currUser.userName == e.target.parentNode.firstChild.innerText ){
  
      await axios.get(`https://3.92.186.223:5000/api/users/${e.target.parentNode.firstChild.innerText.toString()}`).then(res=>{
          window.sessionStorage.setItem('currRec', JSON.stringify(res.data))
      })
      navigate(`/chat/${e.target.parentNode.firstChild.innerText.toString()}`)
  }
}
  }
  const list = (anchor) => (
    <ClickAwayListener
    mouseEvent="onMouseDown"
    touchEvent="onTouchStart"
    onClickAway={handleClickAway}
  >
    <Box
   
      sx={{ width: anchor === 'top' || anchor === 'bottom' ? 'auto' : 250 }}
      role="presentation"
     
    >
      <List>
        {messagesList.map((obj, index) => {
          
         return( <ListItem key={index} disablePadding>
            <ListItemButton className='message-item' id={obj.currUser.userName} onClick = {async(e)=>{
                await axios.get(`https://3.92.186.223:5000/api/users/${e.target.id}`).then(res=>{
                    window.sessionStorage.setItem('currRec', JSON.stringify(res.data))
                })
                navigate(`/chat/${e.target.id}`)
            }} style={{display:'flex',flexDirection:'column',backgroundColor: 'rgba(240, 248, 255, 0.096)', color:'white', fontWeight:600}}>
            <h5 id={obj.currUser.userName} style={{textShadow:'0px 0px', margin:0}}>{obj.currUser.userName}</h5>
            <p className = "preview" id={obj.currUser.userName}>{obj.data[0].text}</p>
            </ListItemButton>
          </ListItem>)
})}
    <ListItem>
    create new message
        <ListItemButton>
            <Select   
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={currentFriendSelection}
            label="Age"
            onChange={(e)=>{
                
                setCurrentFriendSelection(e.target.value)
            }}>
                {friends.map((friend, index)=>{
                   
                    return(
                        <MenuItem key= {index} onClick={(e)=>{getCurrentFriendSelection(e)}} id={friend} value={friend}>{friend}</MenuItem>
                    )
                })}
            </Select>
            
        </ListItemButton>
    </ListItem>
      </List>
      
     
    </Box>
    </ClickAwayListener>
  );
function handleClickAway(){
    console.log(bool+"click away")
    setBool(false)
}
  return (
    <div>
      {['Messages'].map((anchor) => (
        <React.Fragment key={'right'}>
          <Button style={{height:"100%",borderLeft:'1px solid black', borderRadius:0}} onClick={()=>{setBool(true)}}>{anchor}</Button>
         
          <Drawer
          variant='persistent'
            anchor={'right'}
            open={bool}
           
            onClose={toggleDrawer('right', false)}
            
          >
            {list('right')}
          </Drawer>
          
        </React.Fragment>
      ))}
    </div>
  );
}