import React from 'react';
import styles from '../styles.module.css'; // Import your CSS module

const ScoreCalculator = () => {
  return (
    <section className={styles.scoreCalculator}>
      <h3>Score Calculator</h3>
      <form id="movForm">
        <label htmlFor="officialDistance">Official Distance (mi):</label>
        <input type="number" id="officialDistance" name="officialDistance" step="any" min="0" required />

        <label htmlFor="highestDrivingDistance">Highest Driving Distance (mi):</label>
        <input type="number" id="highestDrivingDistance" name="highestDrivingDistance" step="any" min="0" required />

        <label htmlFor="energyStorageCharges">Unmetered Charges:</label>
        <input type="number" id="energyStorageCharges" name="energyStorageCharges" step="any" min="0" required />

        <label htmlFor="energyStorageCapacity">Battery Capacity (kWh):</label>
        <input type="number" id="energyStorageCapacity" name="energyStorageCapacity" step="any" min="0" required />

        <label htmlFor="meteredEnergy">Metered Energy (kWh):</label>
        <input type="number" id="meteredEnergy" name="meteredEnergy" step="any" min="0" required />

        <label htmlFor="targetSpeed">Target Speed:</label>
        <input type="number" id="targetSpeed" name="targetSpeed" step="any" min="0" required />

        <label htmlFor="overallAverageSpeed">Overall Average Speed:</label>
        <input type="number" id="overallAverageSpeed" name="overallAverageSpeed" step="any" min="0" required />

        <label htmlFor="practicalityScore">Practicality Score (%):</label>
        <input type="number" id="practicalityScore" name="practicalityScore" step="any" min="0" required />

      </form>
      <div id="result"></div>
    </section>
  );
}

export default ScoreCalculator;
