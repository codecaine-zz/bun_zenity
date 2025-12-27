import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  const result = await zenity.forms(
    [
      { type: 'entry', label: 'Event Name' },
      { type: 'calendar', label: 'Event Date' },
      { type: 'entry', label: 'Location' },
      { type: 'multiline', label: 'Description' }
    ],
    {
      title: "Schedule Event",
      text: "Enter event details:",
      separator: "|",
      formsDateFormat: "%Y-%m-%d",
      width: 550,
      height: 600
    }
  );

  if (result.button === 'ok' && result.values) {
    const [eventName, eventDate, location, description] = result.values;

    // Validation
    if (!eventName || !eventDate) {
      console.error("✗ Error: Event name and date are required");
      process.exit(1);
    }

    console.log("\n" + "=".repeat(50));
    console.log("✓ EVENT SCHEDULED");
    console.log("=".repeat(50));
    console.log(`Event: ${eventName}`);
    console.log(`Date: ${eventDate}`);
    console.log(`Location: ${location}`);
    console.log(`Description: ${description}`);
    console.log("=".repeat(50));
    process.exit(0);
  } else if (result.button === 'cancel') {
    console.log("✗ Event scheduling cancelled");
    process.exit(1);
  } else {
    console.error("✗ No data received");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
