import React from 'react'
import NavBar from './NavBar'
import FriendsList from './FriendsList'
import Card from './Card'
import Messages from './Messages'
import '../css/Profile.css'
import Posts from './Posts'
function Profile() {
  return (
    <div className='profile'>
      <NavBar/>
      <Card/>
    
     <div className='profile-body'>
     <FriendsList/>
     <Posts></Posts>
      
     </div>


    </div>
  )
}

export default Profile