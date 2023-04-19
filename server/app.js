const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }
});
const port = 4000;
var privateRooms = {}, publicRooms = {};

const getRandomId = () => {
  var id = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz_0123456789', idLength = 10;
  const charactersLength = characters.length;
  for (let i = 0; i < idLength; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return id;
}

const cors = require('cors');
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html')
});

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('join_room', (room) => {
    console.log('at join_room');
    if (room.type ===' public') {
      if (room.id in publicRooms) {
        publicRooms[room.id]['users'].push([room.userName, socket.id]);
      } else {
        publicRooms[room.id] = {
          users: [[room.userName, socket.id]],
          messages: []
        };
      }
    } else {
      if (room.id in privateRooms) {
        privateRooms[room.id]['users'].push([room.userName, socket.id]);
      } else {
        privateRooms[room.id] = {
          users: [[room.userName, socket.id]],
          messages: []
        };
      }
    }
    socket.join(room.id + room.type);
  });

  socket.emit('message', 'hello from server');

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

app.post('/joinParty', (req, res) => {
  var status_code = 200;
  if (req.body.partyType == 'private') {
    if (req.body.roomId in privateRooms) {
      if (privateRooms[req.body.roomId]['password'] === req.body.password) {
        status_code = 200;
      }
    } 
  } else {
    if (req.body.roomId in publicRooms) {
      status_code = 200;
    }
  }
  console.log('got hit at join party api', req.body);
  res.status(status_code).end();
});

app.post('/createParty', (req, res) => {
  roomId = getRandomId();
  console.log('got hit at create party api');
  res.send(roomId);
});


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
