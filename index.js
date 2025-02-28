const express = require('express');
const { fork } = require('child_process');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 8080;

app.use(cors()); // Add this line to enable CORS

const rooms = {};

app.use(express.json()); // For parsing JSON requests

app.get('/random64', (req, res) => {
    const child = fork('api/random64.js');
    child.on('message', (message) => {
        console.log('Message from child:', message);
        res.send(message);
    });
    child.send('start');
});

// Create a new room
app.post('/create-room', (req, res) => {
    const roomId = uuidv4();
    rooms[roomId] = {}; // Initialize room with empty object
    res.send({ roomId });
});

// Add data to room
app.post('/room/:roomId/add', (req, res) => {
    const { roomId } = req.params;
    const { key, value } = req.body;
    if (rooms[roomId]) {
        rooms[roomId][key] = value;
        res.send({ message: 'Data added to room' });
    } else {
        res.status(404).send({ message: 'Room not found' });
    }
});

// Retrieve data from room
app.get('/room/:roomId', (req, res) => {
    const { roomId } = req.params;
    if (rooms[roomId]) {
        res.send(rooms[roomId]);
    } else {
        res.status(404).send({ message: 'Room not found' });
    }
});

app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
