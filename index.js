require('dotenv').config();
const isDevelopment = (process.env.NODE_ENV === 'development');
const express = require('express');
const app = express();
const fs = require('fs');

const options = {
  key: fs.readFileSync('./localhost.key'),
  cert: fs.readFileSync('./localhost.crt')
};
const server = require('https').Server(options, app); // httpS instead of http
const port = process.env.PORT || 443;

app.use(express.static('public'));

server.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

const { Server } = require("socket.io");
const io = new Server(server);

const clients = {};
io.on('connection', socket => {
  clients[socket.id] = { id: socket.id };
  socket.on(`message`, message => {
    io.emit('message', message);
  });

  socket.on('color', color => {
    io.emit('color', color);
  });

  socket.on('range', range => {
    io.emit('range', range);
  })

  socket.on('orientation', (alpha, beta, gamma) => {
    io.emit('orientation', alpha, beta, gamma);
  })

  socket.on('checkBoxNew', checkBoxNew => {
    io.emit('checkBoxNew', checkBoxNew);
  });

  socket.on('disconnect', () => {
    delete clients[socket.id];
    io.emit('clients', clients);
  });

  socket.on('signal', (peerId, signal) => {
    console.log(`Received signal from ${socket.id} to ${peerId}`);
    io.to(peerId).emit('signal', peerId, signal, socket.id);
  });

  io.emit('clients', clients);

});