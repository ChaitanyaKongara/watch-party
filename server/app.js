const express = require('express');
const app = express();
const server = require('http').createServer(app);
const { Server } = require("socket.io");
var Mutex = require('async-mutex').Mutex;

var whiteList = ["http://localhost:3000", "http://192.168.240.91:3000", "http://10.1.35.69:3000", "http://10.1.36.34:3000"]

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
        publicRooms[data.roomId]['users'][data.userId] = data.userName;
        socket.emit("new_url", {...data, url: publicRooms[data.roomId]['url'], userId: 'bot'})

      } else {
        publicRooms[data.roomId] = {
          users: {[data['userId']]: data.userName},
          messages: [],
          url: ''
        };
      }
      release();
    } else {
      let release = await privateLock.acquire();
      if (data.roomId in privateRooms) {
        privateRooms[data.roomId]['users'][data.userId] = data.userName;
        socket.emit("new_url", {...data, url: privateRooms[data.roomId]['url'], userId: 'bot'})
      } else {
        privateRooms[data.roomId] = {
          users: {[data.userId] : data.userName},
          messages: [],
          password: data.password,
          url: ''
        };
      }
      release();
    }
    socket.join(data.roomId);
    io.to(data.roomId).emit("new_users", (data.partyType === 'public' ? publicRooms[data.roomId]['users'] : privateRooms[data.roomId]['users']))
    console.log('updated rooms', socket.rooms, publicRooms, privateRooms);
  });

  socket.on('new_message', (message_data) => {
    console.log('received msg', message_data);

    io.to(message_data.roomId).emit("new_message", message_data);
  });

  socket.on('play_video', (message_data) => {
    console.log('At play video');
    io.to(message_data.roomId).emit("play_video", message_data);
  });

  socket.on('pause_video', (message_data) => {
    console.log('At pause video')
    io.to(message_data.roomId).emit("pause_video", message_data);
  });

  socket.on('new_url', async (message_data) => {
    console.log('url change');
    if (message_data.partyType === 'public') {
      let release = await publicLock.acquire();
      publicRooms[message_data.roomId]['url'] = message_data.url
      release();
    } else {
      let release = await privateLock.acquire();
      privateRooms[message_data.roomId]['url'] = message_data.url
      release();
    }
    io.to(message_data.roomId).emit("new_url", message_data);
  });

  socket.on('goodbye', async (message_data) => {
    console.log('at goodbye')
    if (message_data.partyType === 'public') {
      let release = await publicLock.acquire();
      delete publicRooms[message_data.roomId]['users'][message_data.userId];
      release();
    } else {
      let release = await privateLock.acquire();
      delete privateRooms[message_data.roomId]['users'][message_data.userId];
      release();
    }
    io.to(message_data.roomId).emit("new_users", (message_data.partyType === 'public' ? publicRooms[message_data.roomId]['users'] : privateRooms[message_data.roomId]['users']))
  })

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id, publicRooms);
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
  console.log('got hit at join party api', req.body, publicRooms, privateRooms);
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
