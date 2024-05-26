document.addEventListener("DOMContentLoaded", function () {
  // Add event listener to the form inputs
  const formInputs = document.querySelectorAll("#movForm input[type='number']");
  formInputs.forEach((input, index) => {
    input.addEventListener('input', calculateScore);
    input.addEventListener('keydown', function(event) {
      if (event.key === 'Enter') {
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
  const officialDistance = parseFloat(document.getElementById("officialDistance").value) || 0;
  const highestDrivingDistance = parseFloat(document.getElementById("highestDrivingDistance").value) || 0;
  const energyStorageCharges = parseFloat(document.getElementById("energyStorageCharges").value) || 0;
  const energyStorageCapacity = parseFloat(document.getElementById("energyStorageCapacity").value) || 0;
  const meteredEnergy = parseFloat(document.getElementById("meteredEnergy").value) || 0;
  const targetSpeed = parseFloat(document.getElementById("targetSpeed").value) || 0;
  const overallAverageSpeed = parseFloat(document.getElementById("overallAverageSpeed").value) || 0;
  const practicalityScore = (parseFloat(document.getElementById("practicalityScore").value) || 0) / 100;

  // Calculate total person miles
  const totalPersonMiles = officialDistance * 2;
  
  // Calculate completion factor
  const completionFactor = highestDrivingDistance !== 0 ? officialDistance / highestDrivingDistance : 0;

  // Calculate external energy usage
  const energyUsage = (energyStorageCharges + 1) * energyStorageCapacity + meteredEnergy;

  // Calculate target speed derate
  const targetSpeedDerate = overallAverageSpeed >= targetSpeed ? 1 : Math.pow(0.6, Math.pow(targetSpeed - overallAverageSpeed, 0.4));

  // Calculate the S value
  const S = energyUsage !== 0 ? (totalPersonMiles / energyUsage) * completionFactor * targetSpeedDerate * practicalityScore : 0;

  // Display the result
  document.getElementById("result").innerText = `Score: ${S.toFixed(3)}`;
}
