import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Login from './js/Login';
import Profile from './js/Profile';
import ChatScreen from './js/ChatScreen';
function App() {
  return (
    <div className="App">
     <BrowserRouter>
      <Routes>
        <Route path = '/profile/:_id' element = {<Profile/>}/>
        <Route path = '/chat/:userName' element = {<ChatScreen/>}/>
        <Route  path = '/' element = {<Login/>}/>
      </Routes>
     </BrowserRouter>
    </div>
  );
}

export default App;
