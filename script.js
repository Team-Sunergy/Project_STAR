document.getElementById("movForm").addEventListener("submit", function (event) {
  event.preventDefault();

  // Get input values
  const officialDistance = parseFloat(
    document.getElementById("officialDistance").value
  );
  const highestDrivingDistance = parseFloat(
    document.getElementById("highestDrivingDistance").value
  );
  const energyStorageCharges = parseFloat(
    document.getElementById("energyStorageCharges").value
  );
  const energyStorageCapacity = parseFloat(
    document.getElementById("energyStorageCapacity").value
  );
  const meteredEnergy = parseFloat(
    document.getElementById("meteredEnergy").value
  );

  const totalExternalEnergy = parseFloat(
    document.getElementById("totalExternalEnergy").value
  );
  const targetSpeed = parseFloat(document.getElementById("targetSpeed").value);
  const overallAverageSpeed = parseFloat(
    document.getElementById("overallAverageSpeed").value
  );
  const practicalityScore =
    parseFloat(document.getElementById("practicalityScore").value) / 100;

  // Total Person Miles
  const totalPersonMiles = officialDistance * 2;
  
  // Calculate Completion Factor
  const completionFactor = officialDistance / highestDrivingDistance;

  // Calculate External Energy Usage
  const energyUsage =
    (energyStorageCharges + 1) * energyStorageCapacity + meteredEnergy;

  // Calculate Target Speed Derate
  const targetSpeedDerate =
    overallAverageSpeed >= targetSpeed
      ? 1
      : Math.pow(0.6, Math.pow(targetSpeed - overallAverageSpeed, 0.4));

  // Calculate the S value
  const S =
    (totalPersonMiles / energyUsage) *
    completionFactor *
    targetSpeedDerate *
    practicalityScore;

  // Display the result
  document.getElementById("result").innerText = `The S value is: ${S.toFixed(
    3
  )}`;
});
