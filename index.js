const express = require('express');
const { fork } = require('child_process');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const app = express();
const port = 8080;

app.use(cors({ origin: '*' }));
app.use(express.json());

const activeProcesses = {}; // Store active child processes

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

// Helper to ensure the VCS process is running
function getVcsProcess(sessionId) {
    if (!activeProcesses[sessionId] || activeProcesses[sessionId].killed) {
        activeProcesses[sessionId] = fork('vcs.js');

        activeProcesses[sessionId].on('exit', () => {
            delete activeProcesses[sessionId];
        });
    }
    return activeProcesses[sessionId];
}

app.post('/vcs', (req, res) => {
    const { command, sessionId } = req.body;
    
    if (!command) {
        return res.status(400).json({ error: 'No command provided' });
    }

    const userSessionId = sessionId || uuidv4();
    const child = getVcsProcess(userSessionId);

    const timeout = setTimeout(() => {
        res.status(500).json({ error: 'Command execution timeout' });
    }, 5000);

    child.once('message', (message) => {
        clearTimeout(timeout);
        res.json(message);
    });

    child.send({ sessionId: userSessionId, command });
});

app.use((req, res, next) => {
    console.log(`${req.method} request for '${req.url}'`);
    next();
});

app.listen(port, () => {
    console.log(`Server is running.`);
});
