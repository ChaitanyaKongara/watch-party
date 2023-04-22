import * as React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chat from "./Chat.js";
import ChatIcon from '@mui/icons-material/Chat';
import GroupsIcon from '@mui/icons-material/Groups';
import InfoIcon from '@mui/icons-material/Info';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import FingerprintIcon from '@mui/icons-material/Fingerprint';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      style={{height: "100%"}}
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box style={{height: "100%"}} sx={{ p: 3 }}>
          <Typography style={{height: "100%"}}>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs({socket, data, messages, setMessages}) {
  const [value, setValue] = React.useState(0);
  console.log(data);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  var users = ["chaitanya", "abhinav", "guru", "nv sree harsa","chaitanya", "abhinav", "guru", "nv sree harsa","chaitanya", "abhinav", "guru", "nv sree harsa"]; 
  return (
    <Box sx={{ width: '25%', height: '80%', backgroundColor: '#F4F4F4' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider'}}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          {/* <Tab label="Chat" {...a11yProps(0)} /> */}
          <Tab icon={<ChatIcon />} {...a11yProps(1)} /> 

          <Tab icon={<GroupsIcon />} {...a11yProps(1)} />
          <Tab icon={<InfoIcon />} {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <Chat socket={socket} data={data} messages={messages} setMessages={setMessages}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <List sx={{ width: '100%', maxWidth: 400, height: '80%', overflowY: "scroll", bgcolor: 'background.paper' }}>
          {users.map(x => {
            return (
              <ListItem>
                <ListItemAvatar>
                  <Avatar>
                    <AccountCircleIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={x} secondary="Host" />
              </ListItem>
            );
          })}
        </List>
      </TabPanel>
      <TabPanel value={value} index={2}>
        <List sx={{ width: '100%', maxWidth: 400, height: 600, overflowY: "scroll", bgcolor: 'background.paper' }}>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FingerprintIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={data.roomId} secondary="Room Id" />
          </ListItem>
          {data.partyType === 'private' && 
            <ListItem>
              <ListItemAvatar>
                <Avatar>
                  <VpnKeyIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={data.password} secondary="Password" />
            </ListItem>}
        </List>
      </TabPanel>
    </Box>
  );
}
