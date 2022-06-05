import React from 'react'
import NavBar from './NavBar'
import FriendsList from './FriendsList'
import Card from './Card'
import Messages from './Messages'
import '../css/Profile.css'
function Profile() {
  return (
    <div className='profile'>
      <NavBar/>
      <Card/>
    
     <div className='profile-body'>
     <FriendsList/>
     <div className='posts'> Posts</div>
      <Messages/>
     </div>


    </div>
  )
}

export default Profile