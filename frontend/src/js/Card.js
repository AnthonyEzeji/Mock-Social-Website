import { Avatar, Button, Switch, TextareaAutosize } from '@mui/material'
import axios from 'axios';

import { collection, doc, where,onSnapshot, query, updateDoc, getDoc } from 'firebase/firestore';

import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router';
import '../css/Card.css'
import { db } from './Firebase';
function Card() {
  const [checked, setChecked] = useState(false)
  const [input, setInput] = useState('')
  var params = useParams()
    const [user, setUser] = useState({});
    const [userFirestore, setUserFirestore] = useState({});
    useEffect(() => {
        async function getCardInfo(){
          var obj ={}
          await axios.get(`https://localhost:5000/api/users/1/${params._id}`).then(res=>{
            
            setUser(res.data)
            const q = query(collection(db,'users'), where("userName", "==", `${res.data.userName}`))
             onSnapshot(q,snapshot=>{
              snapshot.docs.forEach(doc=>{
                
                
                 
                setUserFirestore(doc.data())
              })
            })
            
          })
         
        }
        getCardInfo()
    }, [params])
 
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
  return (
    <div className='card'>
        <div className="card-left">
            <Avatar style={{objectFit:'cover'}} src={userFirestore.avatar} id = 'avatar' />
            <h5>{user.userName}</h5>
            <Switch
  checked={checked}
  onChange={handleChange}
  inputProps={{ 'aria-label': 'controlled' }}
/>
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