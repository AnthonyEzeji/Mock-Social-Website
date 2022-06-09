import React from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import '../css/Posts.css'
import { collection, deleteDoc, doc, getDoc, increment, updateDoc } from 'firebase/firestore';
import { db } from './Firebase';
import { Avatar, Input } from '@mui/material';
import { Button } from '@mui/material';
function Post(props) {
    console.log(props.props.post)
    async function handleLikeClick(e){
        console.log(e.target.id.length)
        if(e.target.id.length>0){
            function compareUserName(currentElement){
                if(currentElement != JSON.parse(window.sessionStorage.getItem('session')).user.userName ){
                    return true
                }
            }
            console.log(e.target.id)
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
            console.log(e.target.id)
            deleteDoc(doc(collection(db,"posts"),e.target.id)).then(console.log('deleted'))
        }
    }
  return (
    <li key={props.index} className='post'>
        <div className = 'post-side'>
            
            <Avatar src = 'https://th.bing.com/th/id/OIP.FnEir38XOjP1zzwixrMcgwHaHa?pid=ImgDet&rs=1'></Avatar>
           
        </div>
        
        <div className = 'post-body'>
        <h5 id = "post-username">{props.props.post.data.userName}</h5>
        <p id = 'p'>{props.props.post.data.text}</p>
<div id='likes'>
    <h4>{props.props.post.data.likes.length}</h4>
    <Button style={{backgroundColor:'white', marginRight:5}} onClick={(e)=>handleLikeClick(e)} id={props.props.post.id}>Like </Button>
    {JSON.parse(window.sessionStorage.getItem('session')).user.userName==props.props.post.data.userName?<Button style={{backgroundColor:'red', marginRight:5, color:'white'}} id = {props.props.post.id} onClick={(e)=>handleDeleteClick(e)}>Delete</Button>:<></>}
</div>
        </div>



    </li>
  )
}

export default Post