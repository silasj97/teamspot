const socket = require('socket.io');
const server = require('../server');

const io = socket(server.server);

io.on('connection', (socket) => {
  console.log("connected");
});
