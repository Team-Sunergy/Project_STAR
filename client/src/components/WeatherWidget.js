import React, { useEffect, useState, useCallback } from 'react';
import styles from '../styles.module.css'; // Import your CSS module

const WeatherWidget = () => {
  const [location, setLocation] = useState(null);

  const fetchWeatherByLocation = useCallback((latitude, longitude) => {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=a8d3de4af4087655a0d47aa2bd5699d8&units=imperial`)
      .then(response => response.json())
      .then(data => {
        setLocation({ city: data.name });
        displayWeather(data);
      })
      .catch(error => {
        console.error('Error fetching weather data:', error);
      });
  }, []);

  const fetchLocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      fetchWeatherByLocation(latitude, longitude);
    });
  }, [fetchWeatherByLocation]);

  useEffect(() => {
    fetchLocation();

    const intervalId = setInterval(fetchLocation, 300000); // Fetch location every 5 minutes

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchLocation]);

  return (
    <section className={styles.weatherWidget}>
      <div className={styles.weatherInfo} id="weatherInfo"></div>
    </section>
  );
}

function getWindDirection(angle) {
  const directions = ['↓ N', '↙ NE', '← E', '↖ SE', '↑ S', '↗ SW', '→ W', '↘ NW'];
  return directions[Math.round(angle / 45) % 8];
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
}

function displayWeather(data) {
  const weatherInfo = document.getElementById('weatherInfo');
  weatherInfo.innerHTML = '';

  const cityName = data.name;
  const iconCode = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/w/${iconCode}.png`;
  const temperature = Math.round(data.main.temp);
  const description = capitalizeWords(data.weather[0].description);
  const humidity = data.main.humidity;
  const windSpeed = data.wind.speed;
  const windDirection = getWindDirection(data.wind.deg);
  const clouds = data.clouds.all;

  const weatherHTML = `
    <img src="${iconUrl}" alt="Weather Icon" style="width: 200px; height: 200px;">
    <h2>${cityName}</h2>
    <h3>${temperature}°F</h3>
    <p style="  margin-bottom: 50px; color: #333;">${description}</p>
    <p>Clouds: ${clouds}% </p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind Speed: ${windSpeed} MPH</p>
    <p>Wind Direction: ${windDirection}</p>
  `;

  weatherInfo.innerHTML = weatherHTML;
}

export default WeatherWidget;
