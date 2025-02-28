const express = require('express');
const { fork } = require('child_process');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors()); // Add this line to enable CORS

app.get('/random64', (req, res) => {
    const child = fork('api/random64.js');
    child.on('message', (message) => {
        console.log('Message from child:', message);
        res.send(message);
    });
    child.send('start');
});

app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
