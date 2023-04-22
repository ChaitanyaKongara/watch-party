import React, { useEffect } from "react";
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import CreatePartyForm from "./CreatePartyForm";
import JoinPartyForm from "./JoinPartyForm";
import Button from '@mui/material/Button';
import "./Home.css";

function Home(props) {
  return (
    <div className="home">
      <div className="home_heading">
      <p>Get the party started!</p>
      </div>
      <div className="buttons_div">
        <Popup trigger={<Button variant="contained">Join</Button>} modal={true} children={JoinPartyForm} />
        <Popup trigger={<Button variant="contained">Create</Button>} modal={true} children={CreatePartyForm} />
      </div>
    </div >
  )
}

export default Home;
