import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import './App.css';
import Home from './components/Home';
import WatchParty from "./components/WatchParty";

const setCookie = (name, value, days = 7, path = '/') => {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=' + path
}
  
const getCookie = (name) => {
  return document.cookie.split('; ').reduce((r, v) => {
      const parts = v.split('=')
      return parts[0] === name ? decodeURIComponent(parts[1]) : r
  }, '')
}

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home setCookie={setCookie} getCookie={getCookie} />} />
          <Route path="/party" element={<WatchParty/>}/>
          <Route path="*" Component={NoPage} />
        </Routes>
      </Router>
    </div>
  );
}

function NoPage() {
  return (
    <>
      <h2> Forbidden! Go back to <Link to='/home'> Home</Link> </h2>
    </>
  )
}

export default App;
