import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  const volume = await zenity.scale(
    "Adjust the volume level:",
    {
      title: "Volume Control",
      value: 50,
      minValue: 0,
      maxValue: 100,
      step: 5
    }
  );

  if (volume !== null) {
    console.log(`✓ Volume set to: ${volume}%`);
    // Visual representation
    const bars = '█'.repeat(Math.floor(volume / 5));
    console.log(`Volume: [${bars.padEnd(20)}] ${volume}%`);
    process.exit(0);
  } else {
    console.log("✗ User cancelled");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
