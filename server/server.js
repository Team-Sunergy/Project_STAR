require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());

const CSV_FILE_PATH = path.join(__dirname, 'live_data.csv');

app.use('/client', express.static(path.join(__dirname, 'client')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${process.env.SERVER_HOST}:${PORT}`);
});
