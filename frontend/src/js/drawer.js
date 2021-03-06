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
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import '../css/drawer.css'
import { db } from './Firebase';
import axios from 'axios';
import { Avatar, ClickAwayListener, formControlClasses, MenuItem, Select } from '@mui/material';

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
  const [userFirestore, setUserFirestore] = useState({})
  var arr = []
  var objectToPush = []
  var data = {}
  var messagesArr = []
  var friendName =''
const [bool, setBool] = useState(false)
  var tempArr = []
  const [friends, setFriends] = useState([])
  var currUser = {}
  const [session, setSession] = useState({})
useEffect(() => {
  
  setSession(JSON.parse(window.sessionStorage.getItem('session')))

}, [])

      
      async function getCurrentFriendSelection(e){
          
          await axios.get(`http://3.92.186.223:5000/api/users/${e.target.id}`).then(res=>{
              window.sessionStorage.setItem('currRec',JSON.stringify(res.data))
            
          })
          navigate(`/chat/${e.target.id}`)
      }
   

  
      function compareFriends(currentElement){
   
          if(currentElement.data().user1 == JSON.parse(window.sessionStorage.getItem('session')).user.userName ||currentElement.data().user2 == JSON.parse(window.sessionStorage.getItem('session')).user.userName  ){
              
              return true
          }else{
           
              return false
          }
      }
  
  useEffect(() => {
 onSnapshot(collection(db,'friends'), snapshot=>{
  
      setFriends(snapshot.docs.filter(compareFriends).map(friend=>{
         
          if(friend.data().user1 == JSON.parse(window.sessionStorage.getItem('session')).user.userName ){
            return friend.data().user2
          }else{
              return friend.data().user1
          }
          
      }))
  })
  
   
  }, [session])
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
 useEffect(() => {
   
      async function getMessages(){
       
         
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
  }, [session])

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
          await axios.get(`http://3.92.186.223:5000/api/users/2/${id}`).then(res=>{
             currUser = res.data
             const q = query(collection(db,'users'), where("userName", "==", `${res.data.userName}`))

             onSnapshot(q,snapshot=>{
               console.log(snapshot.docs)
              snapshot.docs.forEach(doc=>{
                
                
                 console.log(doc.data())
                setUserFirestore(doc.data())
              })
            })
            
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
for(var i = 0 ; i < messagesList.length;i++){


  if(messagesList[i].currUser.userName == e.target.parentNode.firstChild.innerText ){
  
      await axios.get(`http://3.92.186.223:5000/api/users/${e.target.parentNode.firstChild.innerText.toString()}`).then(res=>{
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
                await axios.get(`http://3.92.186.223:5000/api/users/${e.target.id}`).then(res=>{
                    window.sessionStorage.setItem('currRec', JSON.stringify(res.data))
                })
                navigate(`/chat/${e.target.id}`)
            }} style={{display:'flex',flexDirection:'column',backgroundColor: 'rgba(54, 20, 20)', color:'white', fontWeight:600}}>
              <div style={{display:'flex', width:'fit-content', height:'fit-content', justifyContent:'center', alignItems:'center'}}>
                <Avatar src={userFirestore.avatar}></Avatar>
              <h4 id={obj.currUser.userName} style={{textShadow:'1px 1px black', margin:0, marginLeft:5}}>{obj.currUser.userName}</h4>
              </div>
            
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

    setBool(false)
}

  return (
    <div>
      {['Messages'].map((anchor) => (
        <React.Fragment key={'right'}>
          <Button className='nav-btn' style={{height:"100%",borderLeft:'1px solid black', borderRadius:0, color:'white'}} onClick={()=>{setBool(true)}}>{anchor}</Button>
         
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