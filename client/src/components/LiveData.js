import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import styles from '../styles.module.css'; // Import CSS module

const socket = io('http://localhost:3000');

const LiveData = () => {
  const [speed, setSpeed] = useState('00 MPH');
  const [distance, setDistance] = useState('0.0 mi');
  const [soc, setSoc] = useState('0.0%');
  const [battTemp, setBattTemp] = useState('0 F');
  const [difference, setDifference] = useState('0%');
  const [intake, setIntake] = useState('0V / 0A');
  const [output, setOutput] = useState('0V / 0A');
  const [net, setNet] = useState('0V / 0A');
  const [maxCell, setMaxCell] = useState('0%');
  const [minCell, setMinCell] = useState('0%');
  const [mppt1Voltage, setMppt1Voltage] = useState('0.0 V');
  const [mppt1Current, setMppt1Current] = useState('0.0 A');
  const [mppt1Temp, setMppt1Temp] = useState('0.0 F');
  const [mppt2Voltage, setMppt2Voltage] = useState('0.0 V');
  const [mppt2Current, setMppt2Current] = useState('0.0 A');
  const [mppt2Temp, setMppt2Temp] = useState('0.0 F');
  const [motor1Voltage, setMotor1Voltage] = useState('0.0 V');
  const [motor1Current, setMotor1Current] = useState('0.0 A');
  const [motor1Temp, setMotor1Temp] = useState('0.0 F');
  const [motor2Voltage, setMotor2Voltage] = useState('0.0 V');
  const [motor2Current, setMotor2Current] = useState('0.0 A');
  const [motor2Temp, setMotor2Temp] = useState('0.0 F');
  const [faultCode, setCode] = useState('Fault Code');
  const [faultMessage, setMessage] = useState('Fault Message');
  const [faultSolution, setSolution] = useState('Fault Solution');

  useEffect(() => {
    socket.on('newData', (newData) => {
      updateValues(newData);
    });

    return () => {
      socket.off('newData');
    };
  }, []);

  const updateValues = (newData) => {
    setSpeed(`${newData.speed}`);
    setDistance(`${newData.distance}`);
    setSoc(`${newData.soc}`);
    setBattTemp(`${newData.battTemp}`);
    setDifference(`${newData.difference}`);
    setIntake(`${newData.intakeVoltage} / ${newData.intakeCurrent}`);
    setOutput(`${newData.outputVoltage} / ${newData.outputCurrent}`);
    setNet(`${newData.netVoltage} / ${newData.netCurrent}`);
    setMaxCell(`${newData.maxCell}`);
    setMinCell(`${newData.minCell}`);
    setMppt1Voltage(`${newData.mppt1Voltage}`);
    setMppt1Current(`${newData.mppt1Current}`);
    setMppt1Temp(`${newData.mppt1Temp}`);
    setMppt2Voltage(`${newData.mppt2Voltage}`);
    setMppt2Current(`${newData.mppt2Current}`);
    setMppt2Temp(`${newData.mppt2Temp}`);
    setMotor1Voltage(`${newData.motor1Voltage}`);
    setMotor1Current(`${newData.motor1Current}`);
    setMotor1Temp(`${newData.motor1Temp}`);
    setMotor2Voltage(`${newData.motor2Voltage}`);
    setMotor2Current(`${newData.motor2Current}`);
    setMotor2Temp(`${newData.motor2Temp}`);
    setCode(`${newData.faultCode}`);
    setMessage(`${newData.faultMessage}`);
    setSolution(`${newData.faultSolution}`);
  };

  return (
    <section className={styles.liveData}>
      <div className={styles.status}>
        <div className={styles.statusCol1}>
          <p>Speed = {speed}</p>
          <p>Distance = {distance}</p>
          <p>SOC = {soc}</p>
          <p>Batt Temp = {battTemp}</p>
          <p>Difference = {difference}</p>
        </div>
        <div className={styles.statusCol2}>
          <p>Intake = {intake}</p>
          <p>Output = {output}</p>
          <p>NET = {net}</p>
          <p>Max Cell = {maxCell}</p>
          <p>Min Cell = {minCell}</p>
        </div>
      </div>
      <div className={styles.mppt}>
        <div className={styles.mpptSection}>
          <h4>MPPT 1</h4>
          <p>Voltage = {mppt1Voltage}</p>
          <p>Current = {mppt1Current}</p>
          <p>Temp = {mppt1Temp}</p>
        </div>
        <div className={styles.mpptSection}>
          <h4>MPPT 2</h4>
          <p>Voltage = {mppt2Voltage}</p>
          <p>Current = {mppt2Current}</p>
          <p>Temp = {mppt2Temp}</p>
        </div>
        <div className={styles.motorSection}>
          <h4>Motor 1</h4>
          <p>Voltage = {motor1Voltage}</p>
          <p>Current = {motor1Current}</p>
          <p>Temp = {motor1Temp}</p>
        </div>
        <div className={styles.motorSection}>
          <h4>Motor 2</h4>
          <p>Voltage = {motor2Voltage}</p>
          <p>Current = {motor2Current}</p>
          <p>Temp = {motor2Temp}</p>
        </div>
      </div>
      <footer className={styles.footer}>
      <div className={styles.errorMessage}>
        <p>Error Message:</p>
        <p>{faultCode} : {faultMessage} : {faultSolution}</p>
      </div>
      </footer>
    </section>
  );
};

export default LiveData;
