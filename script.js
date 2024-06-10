document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to the form inputs
  const formInputs = document.querySelectorAll("#movForm input[type='number']");
  formInputs.forEach((input, index) => {
    input.addEventListener("input", calculateScore);
    input.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent form submission
        const nextInput = formInputs[index + 1];
        if (nextInput) {
          nextInput.focus(); // Move focus to the next input field
        }
      }
    });
  });
});

function calculateScore() {
  // Get input values
  const officialDistance =
    parseFloat(document.getElementById("officialDistance").value) || 0;
  const highestDrivingDistance =
    parseFloat(document.getElementById("highestDrivingDistance").value) || 0;
  const energyStorageCharges =
    parseFloat(document.getElementById("energyStorageCharges").value) || 0;
  const energyStorageCapacity =
    parseFloat(document.getElementById("energyStorageCapacity").value) || 0;
  const meteredEnergy =
    parseFloat(document.getElementById("meteredEnergy").value) || 0;
  const targetSpeed =
    parseFloat(document.getElementById("targetSpeed").value) || 0;
  const overallAverageSpeed =
    parseFloat(document.getElementById("overallAverageSpeed").value) || 0;
  const practicalityScore =
    (parseFloat(document.getElementById("practicalityScore").value) || 0) / 100;

  // Calculate total person miles
  const totalPersonMiles = officialDistance * 2;

  // Calculate completion factor
  const completionFactor =
    highestDrivingDistance !== 0
      ? officialDistance / highestDrivingDistance
      : 0;

  // Calculate external energy usage
  const energyUsage =
    (energyStorageCharges + 1) * energyStorageCapacity + meteredEnergy;

  // Calculate target speed derate
  const targetSpeedDerate =
    overallAverageSpeed >= targetSpeed
      ? 1
      : Math.pow(0.6, Math.pow(targetSpeed - overallAverageSpeed, 0.4));

  // Calculate the S value
  const S =
    energyUsage !== 0
      ? (totalPersonMiles / energyUsage) *
      completionFactor *
      targetSpeedDerate *
      practicalityScore
      : 0;

  // Display the result
  document.getElementById("result").innerText = `Score: ${S.toFixed(3)}`;
}

//Clock function
function updateTime() {
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

  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
  document.getElementById('ampm').textContent = ampm;
}

updateTime();
setInterval(updateTime, 1000);

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


