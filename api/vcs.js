const { exec } = require('child_process');

process.on('message', (cmd) => {
    exec(cmd, (error, stdout, stderr) => {
        if (error) {
            process.send({ error: error.message });
            return;
        }
        if (stderr) {
            process.send({ error: stderr });
            return;
        }
        process.send({ output: stdout });
    });
});
