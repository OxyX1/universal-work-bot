const crypto = require('crypto');

process.on('message', (msg) => {
    if (msg === 'start') {
        const randomHex = crypto.randomBytes(32).toString('hex'); // 64-byte hex
        process.send(randomHex);
    }
});
