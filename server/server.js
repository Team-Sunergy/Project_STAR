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
    { id: 'speed', title: 'Speed' },
    { id: 'distance', title: 'Distance' },
    { id: 'soc', title: 'SOC' },
    { id: 'battTemp', title: 'Batt Temp' },
    { id: 'difference', title: 'Difference' },
    { id: 'intakeVoltage', title: 'Intake Voltage' },
    { id: 'intakeCurrent', title: 'Intake Current' },
    { id: 'outputVoltage', title: 'Output Voltage' },
    { id: 'outputCurrent', title: 'Output Current' },
    { id: 'netVoltage', title: 'NET Voltage' },
    { id: 'netCurrent', title: 'NET Current' },
    { id: 'maxCell', title: 'Max Cell' },
    { id: 'minCell', title: 'Min Cell' },
    { id: 'mppt1Voltage', title: 'MPPT 1 Voltage' },
    { id: 'mppt1Current', title: 'MPPT 1 Current' },
    { id: 'mppt1Temp', title: 'MPPT 1 Temp' },
    { id: 'mppt2Voltage', title: 'MPPT 2 Voltage' },
    { id: 'mppt2Current', title: 'MPPT 2 Current' },
    { id: 'mppt2Temp', title: 'MPPT 2 Temp' },
    { id: 'motor1Voltage', title: 'Motor 1 Voltage' },
    { id: 'motor1Current', title: 'Motor 1 Current' },
    { id: 'motor1Temp', title: 'Motor 1 Temp' },
    { id: 'motor2Voltage', title: 'Motor 2 Voltage' },
    { id: 'motor2Current', title: 'Motor 2 Current' },
    { id: 'motor2Temp', title: 'Motor 2 Temp' },
  ]
});

let dataBuffer = [];

// Simulate LoRa data for each constant in live data
const simulateLoRaData = () => {
  setInterval(() => {
    const newData = {
      speed: (Math.random() * 100).toFixed(2) + ' MPH',
      distance: (Math.random() * 100).toFixed(1) + ' mi',
      soc: (Math.random() * 100).toFixed(1) + '%',
      battTemp: (Math.random() * 100).toFixed(1) + ' F',
      difference: (Math.random() * 100).toFixed(1) + '%',
      intakeVoltage: `${(Math.random() * 100).toFixed(1)}V`,
      intakeCurrent: `${(Math.random() * 10).toFixed(1)}A`,
      outputVoltage: `${(Math.random() * 100).toFixed(1)}V`,
      outputCurrent: `${(Math.random() * 10).toFixed(1)}A`,
      netVoltage: `${(Math.random() * 100).toFixed(1)}V`,
      netCurrent: `${(Math.random() * 10).toFixed(1)}A`,
      maxCell: (Math.random() * 100).toFixed(1) + '%',
      minCell: (Math.random() * 100).toFixed(1) + '%',
      mppt1Voltage: (Math.random() * 50).toFixed(1) + ' V',
      mppt1Current: (Math.random() * 5).toFixed(1) + ' A',
      mppt1Temp: (Math.random() * 50).toFixed(1) + ' F',
      mppt2Voltage: (Math.random() * 50).toFixed(1) + ' V',
      mppt2Current: (Math.random() * 5).toFixed(1) + ' A',
      mppt2Temp: (Math.random() * 50).toFixed(1) + ' F',
      motor1Voltage: (Math.random() * 50).toFixed(1) + ' V',
      motor1Current: (Math.random() * 5).toFixed(1) + ' A',
      motor1Temp: (Math.random() * 50).toFixed(1) + ' F',
      motor2Voltage: (Math.random() * 50).toFixed(1) + ' V',
      motor2Current: (Math.random() * 5).toFixed(1) + ' A',
      motor2Temp: (Math.random() * 50).toFixed(1) + ' F',
    };

    const timestamp = new Date().toISOString();
    const record = { timestamp, ...newData };
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

// Save data to CSV every second
setInterval(() => {
  if (dataBuffer.length) {
    csvWriter.writeRecords(dataBuffer)
      .then(() => {
        console.log('Data written to CSV file');
        dataBuffer = [];
      });
  }
}, 1000);
