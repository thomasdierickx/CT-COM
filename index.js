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
    console.log(`Received message: ${message}`);
    io.emit('message', message);
  });

  socket.on('color', color => {
    console.log(`Received color: ${color}`);
    io.emit('color', color);
  });

  socket.on('range', range => {
    console.log(`Received this range: ${range}`);
    io.emit('range', range);
  })

  socket.on('alpha', alpha => {
    console.log(`Received this alpha: ${alpha}`);
    io.emit('alpha', alpha);
  })

  socket.on('beta', beta => {
    console.log(`Received this beta: ${beta}`);
    io.emit('beta', beta);
  })

  socket.on('gamma', gamma => {
    console.log(`Received this gamma: ${gamma}`);
    io.emit('gamma', gamma);
  })

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