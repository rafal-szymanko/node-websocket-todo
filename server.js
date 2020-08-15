const express = require('express');
const app = express();
const port = 8000;
const path = require('path');
const socket = require('socket.io');

const tasks = ['Shopping', 'Go out with a dog'];

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});

 
const io = socket(server);

io.on('connection', (socket) => {
    socket.emit('updateData', tasks);
  socket.on('addTask', (newTask) => {
    tasks.push(newTask.task);
    console.log(tasks)
    socket.broadcast.emit('addTask', newTask);
  });

  socket.on('removeTask', (taskId) => {
    
    const isLocal = false;
    tasks.splice(taskId, 1);
    socket.broadcast.emit('removeTask', {id: taskId, isLocal});
  });
  socket.on('disconnect', () => {});
});

