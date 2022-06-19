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
          await axios.get(`http://3.92.186.223:5000/api/users/1/${params._id}`).then(res=>{
            console.log(res.data)
            setUser(res.data)
            const q = query(collection(db,'users'), where("userName", "==", `${res.data.userName}`))

            onSnapshot(q,snapshot=>{
              console.log(snapshot.docs)
             snapshot.docs.forEach(doc=>{
               
               
                console.log(doc.data())
               setUserFirestore(doc.data())
             })
           })
            
          })
        
        }
       
          getCardInfo()
        
        
    }, [params])
  console.log(user)

  console.log(userFirestore)
    
   
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
    
    
    var navigate = useNavigate()
 
  return (
    <div className='card'>
        <div className="card-left">
            <Avatar onClick={()=>navigate('/file-picker')} style={{objectFit:'cover'}} src={userFirestore.avatar} id = 'avatar' />
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
            <TextareaAutosize onChange={(e)=>{setInput(e.target.value)}} style={{textAlign:"center",width:'96%', borderRadius:'20px',height:'96%',maxHeight:'96%', maxWidth:"96%"}} readOnly={!checked} defaultValue={userFirestore.bio}>{}</TextareaAutosize>
        </div>
    </div>
  )
}

export default Card