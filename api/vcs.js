const { exec } = require('child_process');

process.on('message', (message) => {
    const { sessionId, command } = message;

    // Execute the shell command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            process.send({ sessionId, error: stderr || error.message });
        } else {
            process.send({ sessionId, output: stdout || 'Command executed successfully' });
        }
    });
});
