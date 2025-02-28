const express = require('express');
const http = require('http');
const path = require('path');
const {fork} = require('child_process');
const port = process.env.PORT || 8080;

const app = express();

app.get('/random64', (req, res) => {
    const child = fork('api/random64.js');
    child.on('message', (message) => {
        console.log('Message from child: ' + message);
        res.send(message);
    });
    child.send('start');
});

app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});