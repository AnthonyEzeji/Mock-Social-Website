import axios from 'axios';
import { addDoc, collection, doc, getDoc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import {storage} from "./Firebase"
import {getMetadata, ref, uploadBytes} from 'firebase/storage'
import {v4} from "uuid"
import React,{Component, useEffect, useState} from 'react';
import { db } from './Firebase';
import { Navigate, useNavigate } from 'react-router';
import NavBar from './NavBar';
 
function FilePicker() {
    async function setAvatar(data){
        var imagePath = `images/${data.selectedFileName+v4()}`
        const imageRef = ref(storage,imagePath )
        uploadBytes(imageRef, data.selectedFile)
       
        
       
        const q = query(collection(db,'users'), where("userName", "==", JSON.parse(window.sessionStorage.getItem('session')).user.userName))
        onSnapshot(q,snapshot=>{
            snapshot.docs.forEach(doc1=>{
                var docRef = doc(collection(db,"users"),doc1.id)
                updateDoc(docRef,{avatar:imagePath})
                
            })

        })
        
    }
  const [state, setState] = useState({ selectedFile: null})
  
    function onFileChange(event){
    
    
      setState({ selectedFile: event.target.files[0] });
    
    };
    
  
    var navigate=useNavigate()
    function onFileUpload() {
    
   
      const formData = {
      selectedFile:state.selectedFile,
      selectedFileName:state.selectedFile.name};
  
    
    
      console.log(state.selectedFile);
     
    
    
      
      setAvatar(formData);
      navigate(`/profile/${JSON.parse(window.sessionStorage.getItem('session')).user._id}`)
    };


    function fileData(){
    
      if (state.selectedFile) {
         
        return (
          <div>
            <h2>File Details:</h2>
             
<p>File Name: {state.selectedFile.name}</p>
 
             
<p>File Type: {state.selectedFile.type}</p>
 
             
<p>
              Last Modified:{" "}
              {state.selectedFile.lastModifiedDate.toDateString()}
            </p>
 
          </div>
        );
      } else {
        return (
          <div>
            <br />
            <h4>Choose before Pressing the Upload button</h4>
          </div>
        );
      }
    };
    
 
    
      return (
        <div style ={{display:'flex', flexDirection:"column", justifyContent:'center', alignItems:'center', height:"100vh"}}>
          <NavBar ></NavBar>
            <h1>
           Select Avatar
            </h1>
            <h3>
              Upload Photo
            </h3>
            <div>
                <input type="file" onChange={onFileChange} />
                <button onClick={onFileUpload}>
                  Upload!
                </button>
            </div>
          {fileData()}
        </div>
      );
    }
  
 
  export default FilePicker;