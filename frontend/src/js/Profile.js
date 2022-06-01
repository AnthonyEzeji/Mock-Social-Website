import React from 'react'
import NavBar from './NavBar'
import FriendsList from './FriendsList'
import Card from './Card'
import '../css/Profile.css'
function Profile() {
  return (
    <div className='profile'>
      <NavBar/>
      <Card/>
      <FriendsList/>



    </div>
  )
}

export default Profile