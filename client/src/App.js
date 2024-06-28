import React, { useEffect } from 'react';
import Header from './components/Header';
import ScoreCalculator from './components/ScoreCalculator';
import LiveData from './components/LiveData';
import WeatherWidget from './components/WeatherWidget';
// import Footer from './components/Footer';
import './styles.module.css'

function App() {
  useEffect(() => {
    // Function to update time
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      let ampm = 'AM';

      if (hours > 12) {
        hours -= 12;
        ampm = 'PM';
      }

      if (hours === 0) {
        hours = 12;
      }

      // Check if elements exist before updating
      const hoursElement = document.getElementById('hours');
      const minutesElement = document.getElementById('minutes');
      const ampmElement = document.getElementById('ampm');

      if (hoursElement && minutesElement && ampmElement) {
        hoursElement.textContent = hours;
        minutesElement.textContent = minutes;
        ampmElement.textContent = ampm;
      }
    };

    // Call updateTime initially
    updateTime();

    // Set interval to update time every second
    const intervalId = setInterval(updateTime, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []); // Empty dependency array ensures useEffect runs only once after mount

  return (
    <div className="App">
      <Header />
      <main>
        <ScoreCalculator />
        <LiveData />
        <WeatherWidget />
      </main>
      {/* <Footer /> */}
    </div>
  );
}

export default App;