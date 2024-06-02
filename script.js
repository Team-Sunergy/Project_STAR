//Score Calculator Form
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
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  document.getElementById('hours').textContent = hours;
  document.getElementById('minutes').textContent = minutes;
}

updateTime();
setInterval(updateTime, 1000);

//Live Data Section
// Function to fetch live data from Supabase
function fetchLiveData() {
  fetch('YOUR_SUPABASE_URL/can_data')
    .then(response => response.json())
    .then(data => {
      data.forEach(item => {
        // Update status section
        document.querySelector('.status p:nth-child(1)').textContent = `Speed = ${item.speed} MPH`;
        document.querySelector('.status p:nth-child(2)').textContent = `Distance = ${item.distance} mi`;
        document.querySelector('.status p:nth-child(3)').textContent = `SOC = ${item.soc}%`;
        document.querySelector('.status p:nth-child(4)').textContent = `Intake = ${item.intake}V / ${item.intake_a}A`;
        document.querySelector('.status p:nth-child(5)').textContent = `Output = ${item.output}V / ${item.output_a}A`;
        document.querySelector('.status p:nth-child(6)').textContent = `NET = ${item.net}V / ${item.net_a}A`;
        document.querySelector('.status p:nth-child(7)').textContent = `Max Cell = ${item.max_cell}%`;
        document.querySelector('.status p:nth-child(8)').textContent = `Min Cell = ${item.min_cell}%`;
        document.querySelector('.status p:nth-child(9)').textContent = `Difference = ${item.difference}%`;
        document.querySelector('.status p:nth-child(10)').textContent = `Batt Temp = ${item.batt_temp} F`;

        // Update MPPT sections
        document.querySelector('.mppt-section:nth-of-type(1) p:nth-of-type(1)').textContent = `Voltage = ${item.mppt1_voltage} V`;
        document.querySelector('.mppt-section:nth-of-type(1) p:nth-of-type(2)').textContent = `Current = ${item.mppt1_current} A`;
        document.querySelector('.mppt-section:nth-of-type(1) p:nth-of-type(3)').textContent = `Temp = ${item.mppt1_temp} F`;

        document.querySelector('.mppt-section:nth-of-type(2) p:nth-of-type(1)').textContent = `Voltage = ${item.mppt2_voltage} V`;
        document.querySelector('.mppt-section:nth-of-type(2) p:nth-of-type(2)').textContent = `Current = ${item.mppt2_current} A`;
        document.querySelector('.mppt-section:nth-of-type(2) p:nth-of-type(3)').textContent = `Temp = ${item.mppt2_temp} F`;

        // Update motor sections
        document.querySelector('.motor-section:nth-of-type(1) p:nth-of-type(1)').textContent = `Voltage = ${item.motor1_voltage} V`;
        document.querySelector('.motor-section:nth-of-type(1) p:nth-of-type(2)').textContent = `Current = ${item.motor1_current} A`;
        document.querySelector('.motor-section:nth-of-type(1) p:nth-of-type(3)').textContent = `Temp = ${item.motor1_temp} F`;

        document.querySelector('.motor-section:nth-of-type(2) p:nth-of-type(1)').textContent = `Voltage = ${item.motor2_voltage} V`;
        document.querySelector('.motor-section:nth-of-type(2) p:nth-of-type(2)').textContent = `Current = ${item.motor2_current} A`;
        document.querySelector('.motor-section:nth-of-type(2) p:nth-of-type(3)').textContent = `Temp = ${item.motor2_temp} F`;
      });
    })
    .catch(error => {
      console.error('Error fetching live data:', error);
    });
}

// Call fetchLiveData function initially
fetchLiveData();

// Set interval to fetch live data periodically (e.g., every 1 second)
setInterval(fetchLiveData, 1000);
