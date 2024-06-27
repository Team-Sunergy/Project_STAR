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
  const city = document.getElementById('cityInput').value;

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a8d3de4af4087655a0d47aa2bd5699d8&units=imperial`)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
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

function searchWeatherByLocation() {
  // Fetch the user's IP address
  fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(ipData => {
      // Use the IP address to fetch geolocation data
      fetch(`https://ipinfo.io/${ipData.ip}?token=607e2af9981046`)
        .then(response => response.json())
        .then(locationData => {
          const city = locationData.city;
          fetchWeatherByCity(city);
        })
        .catch(error => {
          console.error('Error fetching geolocation data:', error);
        });
    })
    .catch(error => {
      console.error('Error fetching IP address:', error);
    });
}

function fetchWeatherByCity(city) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=a8d3de4af4087655a0d47aa2bd5699d8&units=imperial`)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

// Call this function to fetch weather based on user's location
searchWeatherByLocation();

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
