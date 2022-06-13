import React, { useEffect, useState } from 'react'
import {doc,documentId,FieldPath,query,collection,onSnapshot, orderBy, updateDoc, increment, where, setDoc, serverTimestamp, addDoc, getDoc} from 'firebase/firestore'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {db} from './Firebase'

import '../css/Posts.css'
import { Button, Input, TextareaAutosize } from '@mui/material';
import Post from './Post';
import axios from 'axios';
import { useParams } from 'react-router';
import { RefreshButton, useRefresh } from 'react-admin';
function Posts() {
    var params = useParams()
    const [friendsList, setFriendsList] = useState([])
    const [userPosts, setUserPosts] = useState([])
    const [userFirestore, setUserFirestore] = useState({})
    const [inputValue, setInputValue] = useState('')
    var arr = []

    useEffect(() => {
        async function getSesisonUserInfo(){
            const q = query(collection(db,'users'), where("userName", "==", `${JSON.parse(window.sessionStorage.getItem('session')).user.userName}` ))
              onSnapshot(q,snapshot=>{
                  console.log(snapshot.docs)
                  snapshot.forEach(doc=>{
                      setUserFirestore(doc.data())
                  })
              })
             
        }
       

    
      return () => {
        getSesisonUserInfo()
      }
    }, [])
    
    useEffect(() => {
        
        
        
            arr = []
            const friendsRef = collection(db, 'friends')
          const unsub = onSnapshot(friendsRef,snapshot=>{
         
             
              snapshot.docs.forEach(doc=>{
               console.log(doc.data())
                  if(doc.data().user1 == JSON.parse(window.sessionStorage.getItem('session')).user.userName){
                  
                    const q = query(collection(db,'users'), where("userName", "==", `${doc.data().user2}`))
                 
                    onSnapshot(q,snapshot=>{
                      
                        snapshot.forEach(doc=>{
                            
                            arr.push(doc.data())
                        })
                    })
                   
                   
                  }else  if(doc.data().user2 == JSON.parse(window.sessionStorage.getItem('session')).user.userName){
                      
                    const q = query(collection(db,'users'), where("userName", "==", `${doc.data().user1}`))
                    onSnapshot(q,snapshot=>{
                        snapshot.forEach(doc=>{
                            arr.push(doc.data())
                        })
                    })
                  }
              })
              
            console.log(arr)
              setFriendsList(arr)
          })
         
        
        return ()=>{
            unsub()
        }
       
        }, [params])
       
        useEffect(() => {
            console.log(friendsList)
            async function getFriendsList(){
             friendsList.forEach(async friend=>{
                 const q = query(collection(db,'users'), where("userName", "==", `${friend}`))
                await onSnapshot(q,snapshot=>{
                    console.log(snapshot.docs)
                   snapshot.docs.forEach(doc=>{
                     setUserFirestore(doc.data())
                   })
                 })
             })
     
             }
            
             
             return () => {
                 getFriendsList()
             };
         }, [friendsList]);
        
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
          if(friend.userName == currentElement.data().userName){
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
const [bool, setBool] = useState(true)
function handlePostSubmit(e){
    
    if(e.key == "Enter"){
        e.preventDefault()
        var postsRef = collection(db,'posts')
        console.log(userFirestore.avatar)
        console.log(JSON.parse(window.sessionStorage.getItem('session')).user.userName)
        console.log(e.target.value)
        addDoc(postsRef, {text:e.target.value, userName:JSON.parse(window.sessionStorage.getItem('session')).user.userName,likes:[], createdAt:serverTimestamp(),avatar:userFirestore.avatar})
        e.target.value = ""
        
    }
    
  
}
useEffect(() => {
console.log(bool)
}, [bool])


  return (
    <div className='posts'>
        <h3>Posts</h3>
        <ul className='posts-container'>
       
        <TextareaAutosize
        id ="post-input"
        onChange={(e)=>{setInputValue(e.target.value)}}
  aria-label="empty textarea"
  placeholder="Whats on your mind?"
  style={{ width: "98%", }}
  onKeyDown={(e)=>handlePostSubmit(e)}
/>
           
            {posts.map((post,index)=>{
                
            return(<Post  key= {index}props = {{post,index,friendsList,userFirestore}}></Post>)
        })}
            </ul>
    </div>
        
        
  )
}

export default Posts