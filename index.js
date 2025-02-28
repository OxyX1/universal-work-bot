const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + 'public', 'index.html');
});

app.get('/viewer', (req, res) => {
    res.sendFile(__dirname + 'public', 'client.html');
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('screen-share', (stream) => {
    io.emit('screen-share', stream);
  });

  socket.on('stop-sharing', () => {
    io.emit('stop-sharing');
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
