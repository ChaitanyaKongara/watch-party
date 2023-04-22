const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
var Mutex = require('async-mutex').Mutex;

var whiteList = ["http://localhost:3000", "http://192.168.240.91:3000"]

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (whiteList.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true
  }
});
const port = 4000;
const privateLock = new Mutex(), publicLock = new Mutex();
var privateRooms = {}, publicRooms = {};

const getRandomId = (idLength = 10) => {
  var id = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ-abcdefghijklmnopqrstuvwxyz_0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < idLength; i++) {
    id += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return id;
}

const cors = require('cors');
const corsOptions ={
    origin: function (origin, callback) {
      if (whiteList.indexOf(origin) !== -1) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }, 
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

  socket.on('join_room', async (data) => {
    console.log('at join_room', data);
    if (data.partyType === 'public') {
      let release = await publicLock.acquire();
      if (data.roomId in publicRooms) {
        publicRooms[data.roomId]['users'].push([data.userName, data.userId]);
      } else {
        publicRooms[data.roomId] = {
          users: [[data.userName, socket.id]],
          messages: []
        };
      }
      release();
    } else {
      let release = await publicLock.acquire();
      if (data.roomId in privateRooms) {
        privateRooms[data.roomId]['users'].push([data.userName, socket.id]);
      } else {
        privateRooms[data.roomId] = {
          users: [[data.userName, data.userId]],
          messages: []
        };
      }
      release();
    }
    socket.join(data.roomId);
    console.log('updated rooms', socket.rooms, publicRooms, privateRooms, publicRooms[data.roomId]['users']);
  });

  socket.on('new_message', (message_data) => {
    console.log('received msg', message_data);
    io.to(message_data.roomId).emit("new_message", message_data);
  })

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);
  });
});

app.post('/joinParty', (req, res) => {
  var status_code = 404;
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
  userId = getRandomId(6);
  console.log('got hit at join party api', req.body, publicRooms);
  res.status(status_code).send({userId: userId});
});

app.post('/createParty', (req, res) => {
  roomId = getRandomId();
  userId = getRandomId(6);
  console.log('got hit at create party api', roomId);
  res.send({roomId: roomId, userId: userId});
});


server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
