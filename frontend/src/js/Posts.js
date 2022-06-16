import React, { useEffect, useState } from 'react'
import {doc,documentId,FieldPath,query,collection,onSnapshot, orderBy, updateDoc, increment, where, setDoc, serverTimestamp, addDoc, getDoc} from 'firebase/firestore'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {db, storage} from './Firebase'

import '../css/Posts.css'
import { Button, Input, TextareaAutosize } from '@mui/material';
import Post from './Post';
import axios from 'axios';

import { Navigate, useNavigate, useParams } from 'react-router';

import { getDownloadURL, ref } from 'firebase/storage';
import { Link, NavLink } from 'react-router-dom';

function Posts() {
    var params = useParams()
    const [friendsList, setFriendsList] = useState([])
    const [userPosts, setUserPosts] = useState([])
    const [userFirestore, setUserFirestore] = useState([])
    const [usersFirestore2, setUsersFirestore2] = useState([])
    const [inputValue, setInputValue] = useState('')
    const [posts, setPosts] = useState([])
    var arr = []


    
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
                            console.log(arr)
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
              
            
              setFriendsList(arr)
          })
         
        
        return ()=>{
            unsub()
        }
       
        }, [params])
       
        console.log(friendsList)
        
        function compareDoc(currentElement){
            var bool = false
            friendsList.forEach(friend=>{
                if(friend.userName == currentElement.data().user.userName){
                    bool = true
                }
            })
            
      return bool
        }
        
        function sortCreatedAt(first, second) {
        
          if (first.data().createdAt > second.data().createdAt) {
             return -1;
          }
          if (first.data().createdAt < second.data().createdAt) {
             return 1;
          }
          return 0;
       }
    useEffect(() => {
        
     
   
 async function getPosts(){
    var arr2 = []
    var arr3= []

var postsRef = collection(db,'posts')
    const unsubscribe = onSnapshot(postsRef, async snapshot=>{
           
           
            
                
                    
             
        setPosts( snapshot.docs.filter((currentElement)=>{
         console.log(snapshot.docs)
    if(currentElement.data().user.userName == JSON.parse(window.sessionStorage.getItem('session')).user.userName ){
        return true
    }else{
        return compareDoc(currentElement)
    }
         
        
         
      }).sort(sortCreatedAt).map(doc=>{
          return{id:doc.id,data:doc.data()}
      }))

     })

 



 }
      
    

   getPosts()
    }, [friendsList])

    const [postsToDisplay, setPostsToDisplay] = useState([])
useEffect(() => {
setPostsToDisplay(posts)
}, [posts])


 
 useEffect(() => {
 async function getUserFirestore(){
    const q = query(collection(db,'users'), where('userName', "==",JSON.parse(window.sessionStorage.getItem('session')).user.userName ))
    onSnapshot(q, snapshot=>{
        setUserFirestore(snapshot.docs[0].data())
    })
 }
 getUserFirestore()
 }, [])
 console.log(userFirestore)



function handleLikeClick(e){
   
    var postsRef = collection(db,"posts")
    var ref = doc(postsRef,e.target.id)
    
    updateDoc(ref,{"likes":increment(1)})
}
const [bool, setBool] = useState(true)

async function handlePostSubmit(e){
    var doc = {}
    if(e.key == "Enter"){
        if(userFirestore.avatar.length>0){
            const promise = await getDownloadURL(ref(storage, `${userFirestore.avatar}`)).then(url=>{
                const postsRef = collection(db,'posts')
                addDoc(postsRef, {text:e.target.value, likes:[], createdAt:serverTimestamp(),user:userFirestore, avatar:url})
                e.target.value = ""
            })
        }else{
           
                const postsRef = collection(db,'posts')
                addDoc(postsRef, {text:e.target.value, likes:[], createdAt:serverTimestamp(),user:userFirestore, avatar:''})
                e.target.value = ""
            
        }
       
        
        
       
     
      
      
    }
    
 
}





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
           
            {postsToDisplay.map((post,index)=>{
              
                    return(<Post  key= {index} props = {{post,index}}></Post>)
                
           
        })}
            </ul>
    </div>
        
        
  )
}

export default Posts