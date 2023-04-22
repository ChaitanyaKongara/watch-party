import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Home from './components/Home';
import WatchParty from "./components/WatchParty";


function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
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
