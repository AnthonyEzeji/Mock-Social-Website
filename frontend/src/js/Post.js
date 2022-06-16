import React, { useEffect, useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import '../css/Posts.css'
import { collection, deleteDoc, doc, getDoc, increment, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db, storage } from './Firebase';
import { Avatar, Input } from '@mui/material';
import { Button } from '@mui/material';
import { getDownloadURL, ref } from 'firebase/storage';

function Post(props) {
    const [index, setIndex] = useState(null)
    
  
useEffect(() => {
  setIndex(props.props.index)

  
}, [])
useEffect(() => {
    
  
    
  }, [index])


    const [avatar, setAvatar] = useState("")
    
    useEffect(() => {
     async function getAvatar(){
        
            const imageRef = ref(storage,`${props.props.post.data.user.avatar}`)
                
            
            const promise = await getDownloadURL(imageRef).then(url=>{
                console.log(url)
             setAvatar(url)
            })
     
 
   }
      getAvatar()
    
        }, []);

    
    
    async function handleLikeClick(e){
 
        if(e.target.id.length>0){
            function compareUserName(currentElement){
                if(currentElement != JSON.parse(window.sessionStorage.getItem('session')).user.userName ){
                    return true
                }
            }
         
            const postsRef = collection(db,"posts")
          
            const ref = await doc(postsRef,e.target.id)
            
           const  docObj = await getDoc(ref)
           var bool = false
            docObj.data().likes.forEach(userName=>{
                if(userName ==JSON.parse(window.sessionStorage.getItem('session')).user.userName){
                    bool = true
                   
                }
            })
            
            if(bool){
                updateDoc(ref,{"likes":docObj.data().likes.filter(compareUserName).map(element=>{
                    return element
                })})
            }else{
                updateDoc(ref,{"likes":[...docObj.data().likes,JSON.parse(window.sessionStorage.getItem('session')).user.userName]})
            }
        }else{
            alert('try again')
        }
        
        
    }
    function handleDeleteClick(e){
       
        if(e.target.id.length>0){
          
            deleteDoc(doc(collection(db,"posts"),e.target.id)).then(console.log('deleted'))
        }
    }
  return (
    <li key={props.index} className='post'>
        <div className = 'post-side'>
            
            <Avatar src = {props.props.post.data.avatar}></Avatar>
           
        </div>
        
        <div className = 'post-body'>
        <h5 id = "post-username">{props.props.post.data.user.userName}</h5>
        <p id = 'p'>{props.props.post.data.text}</p>
<div id='likes'>
    
{JSON.parse(window.sessionStorage.getItem('session')).user.userName==props.props.post.data.user.userName?<Button  style={{color:'white',borderLeft:"1px solid grey" ,borderTop:"1px solid grey", borderRadius:0,width:"50%"}} onClick={(e)=>handleLikeClick(e)} id={props.props.post.id}>like:{props.props.post.data.likes.length}</Button>:<Button style={{borderRight:"1px solid grey",color:'white',borderLeft:"1px solid grey" ,borderTop:"1px solid grey", borderRadius:0,width:"100%"}} onClick={(e)=>handleLikeClick(e)} id={props.props.post.id}>like:{props.props.post.data.likes.length}</Button>}
    {JSON.parse(window.sessionStorage.getItem('session')).user.userName==props.props.post.data.user.userName?<Button className = 'delete-btn' style={{color:'white',borderRight:"1px solid grey" ,borderTop:"1px solid grey", borderRadius:0, color:'white',width:"50%"}} id = {props.props.post.id} onClick={(e)=>handleDeleteClick(e)}>Delete</Button>:<></>}
</div>
        </div>



    </li>
  )
}

export default Post