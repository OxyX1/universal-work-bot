const express = require('express');
const { fork } = require('child_process');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 8080;

app.use(cors({ origin: '*' }));
app.use(express.json());

app.get('/random64', (req, res) => {
    const child = fork('api/random64.js');
    child.on('message', (message) => {
        console.log('Message from child:', message);
        res.send(message);
    });

    child.on('error', (error) => {
        console.error('Child process error:', error);
        res.status(500).send('Error generating secure random hex');
    });

    child.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Child process exited with code ${code}`);
            res.status(500).send('Error in secure64 generation');
        }
    });

    child.send('start');
});

app.get('/secure64', (req, res) => {
    const child = fork('api/secure64.js');

    child.on('message', (message) => {
        console.log('Message from child:', message);
        res.send(message);
    });

    child.on('error', (error) => {
        console.error('Child process error:', error);
        res.status(500).send('Error generating secure random hex');
    });

    child.on('exit', (code) => {
        if (code !== 0) {
            console.error(`Child process exited with code ${code}`);
            res.status(500).send('Error in secure64 generation');
        }
    });

    child.send('start');
});

app.post('/vcs', (req, res) => {
    const { command } = req.body;
    if (!command) {
        return res.status(400).send({ error: 'No command provided' });
    }

    const child = fork('vcs.js');
    child.on('message', (message) => {
        res.send(message);
    });

    child.send(command);
});


app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

app.listen(port, () => {
    console.log(`Server is running.`);
});
