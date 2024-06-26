const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { createObjectCsvWriter } = require('csv-writer');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const csvWriter = createObjectCsvWriter({
  path: 'data.csv',
  header: [
    { id: 'timestamp', title: 'Timestamp' },
    { id: 'data', title: 'Data' },
  ]
});

let dataBuffer = [];

// Replace with actual LoRa receiver code
const simulateLoRaData = () => {
  setInterval(() => {
    const data = Math.random().toFixed(2); // Simulated data
    const timestamp = new Date().toISOString();
    const record = { timestamp, data };
    dataBuffer.push(record);
    io.emit('newData', record);
    console.log(record);
  }, 1000);
};

simulateLoRaData();

app.get('/', (req, res) => {
  res.send('Server is running...');
});

server.listen(3000, () => {
  console.log('Server listening on port 3000');
});

// Save data to CSV every 10 seconds
setInterval(() => {
  if (dataBuffer.length) {
    csvWriter.writeRecords(dataBuffer)
      .then(() => {
        console.log('Data written to CSV file');
        dataBuffer = [];
      });
  }
}, 1000);
