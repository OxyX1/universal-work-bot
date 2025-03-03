const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const ffmpeg = require('fluent-ffmpeg');

process.on('message', (msg) => {
    if (msg.type === 'play') {
        const filePath = './sounds/sample.mp3';
        if (!fs.existsSync(filePath)) {
            process.send({ error: 'Sound file not found' });
        } else {
            process.send({ filePath });
        }
    }

    if (msg.type === 'pitch') {
        const inputFile = './sounds/sample.mp3';
        const outputFile = `./temp/output-${uuidv4()}.mp3`;

        ffmpeg(inputFile)
            .audioFilters('asetrate=44100*1.2,atempo=1/1.2') // Increase pitch
            .save(outputFile)
            .on('end', () => process.send({ filePath: outputFile }))
            .on('error', (err) => process.send({ error: 'Error processing sound', details: err }));
    }
});
