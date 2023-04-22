import React, {useState} from "react";
import ReactLoading from 'react-loading';
import axios from '../axiosConfig.js';
import {useNavigate} from 'react-router-dom';
import TextField from '@mui/material/TextField';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import './partyForms.css';

const loadingStyle = {
  position: 'inherit',
  // top: '35%',
  left: '44%',
  width: '10%',
  height: '10%',
};


function JoinPartyForm() {
  const [status, setStatus] = useState('');
  const [userName, setUserName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [partyType, setPartyType] = useState('public');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const handleJoinParty = (e) => {
    e.preventDefault();
    setStatus('loading');
    axios.post('/joinParty', {roomId: roomId, partyType: partyType, password: password})
      .then(res => {
        navigate('/party', {state: {userName: userName, partyType: partyType, password: password, roomId: roomId, userId: res.data.userId}});
      })
      .catch(err => setStatus('error'))
  }
  if (status === 'loading') {
    return <ReactLoading style={loadingStyle} type={"spin"} color="000"/>
  }
  return (
    <div className="party_form"> 
      <p>Join Party!</p>
      <form onSubmit={handleJoinParty}>
        {status === 'error' && <h3>No such room</h3>}
        <TextField id="outlined-basic" label="Room Id" variant="outlined" onChange={(e) => setRoomId(e.target.value)}/>
        <TextField id="outlined-basic" label="Username" variant="outlined" onChange={(e) => setUserName(e.target.value)}/>
        <RadioGroup
          row
          name="radio-buttons-group"
          value={partyType}
          onChange={(e) => setPartyType(e.target.value)}>
          <FormControlLabel value="public" control={<Radio />} label="Public" />
          <FormControlLabel value="private" control={<Radio />} label="Private" />
        </RadioGroup>
        {partyType === 'private' && <> <TextField id="outlined-basic" label="password" variant="outlined" onChange={(e) => setPassword(e.target.value)}/></>}
        <br/>
        <Button type="submit" variant="contained">Join</Button>

      </form>
    </div> 
  )
}

export default JoinPartyForm;
