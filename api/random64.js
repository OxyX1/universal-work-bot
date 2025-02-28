/* 

this is a base64 generator

*/

const crypto = require('crypto');

process.on('message', () => {
    try {
        const randomb = crypto.randomBytes(64);
        process.send(randomb.toString('hex'));
    } catch (error) {
        process.send({ error: error.message });
    }
});
