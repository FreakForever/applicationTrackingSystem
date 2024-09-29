import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import './index.css'; // Ensure this imports your Tailwind styles
import Login from './Frontend/page/Login';
import Signup from './Frontend/page/Signup';
function App() {
  return (
    <Router>
      <>
      
        
      </>
      <Routes>
        <Route path='/signup' element = {<Signup />}/>
        <Route path='/login' element = {<Login />}/>

      </Routes>
    </Router>
  
  );
}

export default App;