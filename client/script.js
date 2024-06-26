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
  searchWeather(true);
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

function getWindDirection(angle) {
  const directions = ['↓ N', '↙ NE', '← E', '↖ SE', '↑ S', '↗ SW', '→ W', '↘ NW'];
  return directions[Math.round(angle / 45) % 8];
}

function capitalizeWords(str) {
  return str.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });
}

function searchWeather(useGeolocation = false) {
  if (useGeolocation && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
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
}

function successCallback(position) {
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=a8d3de4af4087655a0d47aa2bd5699d8&units=imperial`)
    .then(response => response.json())
    .then(data => {
      displayWeather(data);
    })
    .catch(error => {
      console.error('Error fetching weather data:', error);
    });
}

function errorCallback(error) {
  console.error('Error getting user location:', error);
}

// Call this function to fetch weather based on user's location
searchWeather();

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
      <p style="  margin-bottom: px; color: #333;">${description}</p>
      <p>Clouds: ${clouds}% </p>
      <p>Humidity: ${humidity}%</p>
      <p>Wind Speed: ${windSpeed} MPH</p>
      <p>Wind Direction: ${windDirection}</p>
  `;

  weatherInfo.innerHTML = weatherHTML;
}

//Live Data Section
async function fetchData() {
  try {
    const response = await fetch(`${SERVER_HOST}/update_live_data`);
    // Handle response
  } catch (error) {
    console.error('Error fetching live data:', error);
  }
}

function updateLiveData() {
  const liveData = {

  };

  fetch('http://127.0.0.1:8080/update_live_data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(liveData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to update live data');
      }
    })
    .catch(error => {
      console.error('Error updating live data:', error);
    });
}

// Call updateLiveData() whenever you want to update the live data
setInterval(updateLiveData, 1000);