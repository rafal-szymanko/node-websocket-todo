const express = require('express');
const app = express();
const port = 8000;
const path = require('path');
const socket = require('socket.io');


const tasks = [];

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

 
const io = socket(server);

io.on('connection', (socket) => {
    socket.emit('updateData', tasks);
  socket.on('addTask', (data) => {
    tasks.push(data);
    socket.broadcast.emit('addTask', {name: data.name, id: data.id});
  });

  socket.on('removeTask', (taskId) => {
    const isLocal = false;
    tasks.splice(taskId, 1);
    socket.broadcast.emit('removeTask', {id: taskId, isLocal});
  });
  socket.on('disconnect', () => {});
});

