import React, { useEffect, useState } from 'react'
import {doc,documentId,FieldPath,query,collection,onSnapshot, orderBy, updateDoc, increment, where, setDoc, serverTimestamp, addDoc} from 'firebase/firestore'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {db} from './Firebase'

import '../css/Posts.css'
import { Button, Input, TextareaAutosize } from '@mui/material';
import Post from './Post';
import axios from 'axios';
import { useParams } from 'react-router';
function Posts() {
    var params = useParams()
    const [friendsList, setFriendsList] = useState([])
    const [userPosts, setUserPosts] = useState([])
    var arr = []

    
    useEffect(() => {
        
        
        
            arr = []
            const friendsRef = collection(db, 'friends')
          const unsub = onSnapshot(friendsRef,snapshot=>{
         
             
              snapshot.docs.forEach(doc=>{
               

                  if(doc.data().user1 == JSON.parse(window.sessionStorage.getItem('session')).user.userName){
                    arr.push(doc.data().user2)
                   
                  }else  if(doc.data().user2 == JSON.parse(window.sessionStorage.getItem('session')).user.userName){
                      
                    arr.push(doc.data().user1)
                  }
              })
              
            
              setFriendsList(arr)
          })
         
        
        return ()=>{
            unsub()
        }
       
        }, [params])
        
    const [posts, setPosts] = useState([])
    useEffect(() => {
        var arr2 = []
        var arr3= []
    function compareId(currentElement){
        
        if(currentElement!=null){
            if(currentElement.data().userId == JSON.parse(window.sessionStorage.getItem('session')).user.id){
                return true
            }
        }
    }
    var postsRef = collection(db,'posts')
   
  function compareDoc(currentElement){
      var bool = false
      friendsList.forEach(friend=>{
          if(friend == currentElement.data().userName){
              bool = true
          }
      })
      
return bool
  }

  function sortCreatedAt(first, second) {
      console.log(first+second)
    if (first.data().createdAt > second.data().createdAt) {
       return -1;
    }
    if (first.data().createdAt < second.data().createdAt) {
       return 1;
    }
    return 0;
 }
        var unsubscribe = onSnapshot(postsRef, snapshot=>{
            var tempArr = []
           tempArr = snapshot.docs.filter((currentElement)=>{
               
          if(currentElement.data().userName == JSON.parse(window.sessionStorage.getItem('session')).user.userName ){
              return true
          }else{
              return compareDoc(currentElement)
          }
               
              
               
            }).sort(sortCreatedAt).map(doc=>{
                return{id:doc.id,data:doc.data()}
            })
            
                
                    
             
               setPosts(tempArr)
    
            })
       
        
   
  
    

      return () => {
        unsubscribe()
      }
    }, [friendsList])
  
    
    
function handleLikeClick(e){
    console.log(e.target.id)
    var postsRef = collection(db,"posts")
    var ref = doc(postsRef,e.target.id)
    
    updateDoc(ref,{"likes":increment(1)})
}
function handlePostSubmit(e){
    if(e.key == "Enter"){
        e.preventDefault()
        var postsRef = collection(db,'posts')
        addDoc(postsRef, {text:e.target.value, userName:JSON.parse(window.sessionStorage.getItem('session')).user.userName,likes:[], createdAt:serverTimestamp()})
        e.target.value = ""
        
    }
    
    
}
  return (
    <div className='posts'>
        <h3>Posts</h3>
        <ul className='posts-container'>
       
        <TextareaAutosize
        id ="post-input"
  aria-label="empty textarea"
  placeholder="Whats on your mind?"
  style={{ width: "98%", }}
  onKeyDown={(e)=>handlePostSubmit(e)}
/>
           
            {posts.map((post,index)=>{
                
            return(<Post  key= {index}props = {{post,index}}></Post>)
        })}
            </ul>
    </div>
        
        
  )
}

export default Posts