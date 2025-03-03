const { spawn } = require('child_process');
const { v4: uuidv4 } = require('uuid');

const sessions = {}; // Store user shell processes

process.on('message', (message) => {
    const { sessionId, command } = message;

    if (!sessions[sessionId]) {
        // Start a new shell process for this session
        sessions[sessionId] = spawn('bash'); // Change to 'cmd' for Windows
    }

    const shell = sessions[sessionId];

    shell.stdout.once('data', (data) => {
        process.send({ sessionId, output: data.toString() });
    });

    shell.stderr.once('data', (data) => {
        process.send({ sessionId, error: data.toString() });
    });

    shell.stdin.write(command + '\n'); // Execute command
});
