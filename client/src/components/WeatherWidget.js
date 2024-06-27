import React from 'react';
import styles from '../styles.module.css'; // Import your CSS module

const WeatherWidget = () => {
  return (
    <section className={styles.weatherWidget}>
      <div className={styles.weatherInput}>
        <input type="text" id="cityInput" placeholder="Enter city" />
        <button onClick={searchWeather}>Search</button>
      </div>
      <div className={styles.weatherInfo} id="weatherInfo"></div>
    </section>
  );
}

function searchWeather() {
  // Implement your searchWeather function here
}

export default WeatherWidget;
