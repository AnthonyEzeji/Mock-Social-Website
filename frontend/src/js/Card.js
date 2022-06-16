import { Avatar, Button, Switch, TextareaAutosize } from '@mui/material'
import axios from 'axios';

import { collection, doc, where,onSnapshot, query, updateDoc, getDoc } from 'firebase/firestore';
import {getStorage, getMetadata, ref, getDownloadURL, listAll } from 'firebase/storage';

import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router';
import '../css/Card.css'
import { db, storage } from './Firebase';
function Card() {
  const [checked, setChecked] = useState(false)
  const [input, setInput] = useState('')
  var params = useParams()
    const [user, setUser] = useState({});
    const [userFirestore, setUserFirestore] = useState({});
    const [avatar, setAvatar] = useState('')
    useEffect(() => {
      console.log(params._id)
        async function getCardInfo(){
          var obj ={}
          await axios.get(`http://localhost:5000/api/users/1/${params._id}`).then(res=>{
            console.log(res.data)
            setUser(res.data)
           
            
          })
        
        }
       
          getCardInfo()
        
        
    }, [params])
  console.log(user)
    useEffect(() => {
      async function getUserFirestore(){
        console.log(user)
        const q = query(collection(db,'users'), where("userName", "==", `${user.userName}`))
               onSnapshot(q,snapshot=>{
                snapshot.docs.forEach(doc=>{
                  
                  
                   console.log(doc.data())
                  setUserFirestore(doc.data())
                })
              })
      }
   
    getUserFirestore()
    }, [user])
    console.log(userFirestore)
    useEffect(() => {
      async function getAvatar(){
        console.log(userFirestore.avatar)
      if(typeof userFirestore.avatar !='undefined'){
        const imageRef = ref(storage,`${userFirestore.avatar}`)
        
        console.log(imageRef)
       var promise = await getDownloadURL(imageRef).then(url=>{
        setAvatar(url)
       })
      }
      
    
      }
      getAvatar()

    }, [userFirestore]);
    console.log(avatar)
    function handleChange(){
      
      setChecked(!checked)


    }
    async function handleSaveClick(e){
      console.log(e.target.id)
      const q = query(collection(db,'users'), where("userName", "==", e.target.id))
      var id = ''
      onSnapshot(q,snapshot=>{
        snapshot.docs.forEach(async doc1=>{
          console.log(doc1.data())
          id = doc1.id
          console.log(doc1.id)
          
          var usersRef = collection(db,"users")
          var ref = doc(usersRef,id)
          
          updateDoc(ref,{"bio":input})
        })
      })
      console.log(id)
     
     
      
    }
    
    console.log(userFirestore)
    var navigate = useNavigate()
    console.log('done')
  return (
    <div className='card'>
        <div className="card-left">
            <Avatar onClick={()=>navigate('/file-picker')} style={{objectFit:'cover'}} src={avatar} id = 'avatar' />
            <h5>{user.userName}</h5>
            {params._id==JSON.parse(window.sessionStorage.getItem('session')).user._id?<Switch
  checked={checked}
  onChange={handleChange}
  inputProps={{ 'aria-label': 'controlled' }}
/>:<></>}
{checked?<Button id={userFirestore.userName} onClick={(e)=>handleSaveClick(e)}>Save</Button>:<></>}
        </div>
        <div className="bio">
            <h3>Bio</h3>
            <TextareaAutosize onChange={(e)=>{setInput(e.target.value)}} style={{textAlign:"center",width:'100%',height:'100%',maxHeight:'98%', maxWidth:"98%"}} readOnly={!checked} defaultValue={userFirestore.bio}>{}</TextareaAutosize>
        </div>
    </div>
  )
}

export default Card