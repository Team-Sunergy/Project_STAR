const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

const CSV_FILE_PATH = path.join(__dirname, 'live_data.csv');

// Route to receive live data updates
app.post('/update_live_data', (req, res) => {
    const newData = req.body;
    const csvRow = Object.values(newData).join(',') + '\n';

    fs.appendFile(CSV_FILE_PATH, csvRow, (err) => {
        if (err) {
            console.error('Error appending data to CSV:', err);
            res.status(500).send('Error appending data to CSV');
        } else {
            console.log('Data appended to CSV successfully');
            res.sendStatus(200);
        }
    });
});

const PORT = 8080;
const HOST = '152.10.118.220';

app.listen(PORT, HOST, () => {
    console.log(`Server running on http://${HOST}:${PORT}`);
});
