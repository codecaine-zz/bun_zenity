import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  const result = await zenity.forms(
    [
      { type: 'entry', label: 'Traveler Name' },
      { 
        type: 'combo', 
        label: 'Destination', 
        values: ['Paris, France', 'Tokyo, Japan', 'New York, USA', 'London, UK', 'Dubai, UAE', 'Sydney, Australia'] 
      },
      { type: 'calendar', label: 'Departure Date' },
      { 
        type: 'combo', 
        label: 'Class', 
        values: ['Economy', 'Premium Economy', 'Business', 'First Class'] 
      }
    ],
    {
      title: "Flight Booking",
      text: "Book your flight:",
      separator: "|",
      formsDateFormat: "%Y-%m-%d",
      showHeader: true,
      width: 550,
      height: 550
    }
  );

  if (result.button === 'ok' && result.values) {
    const [name, destination, date, travelClass] = result.values;

    // Validation
    if (!name || !destination || !date) {
      console.error("✗ Error: Name, destination, and date are required");
      process.exit(1);
    }

    console.log("\n" + "=".repeat(50));
    console.log("✓ FLIGHT BOOKING CONFIRMATION");
    console.log("=".repeat(50));
    console.log(`Passenger: ${name}`);
    console.log(`Destination: ${destination}`);
    console.log(`Departure: ${date}`);
    console.log(`Class: ${travelClass}`);
    console.log("=".repeat(50));
    console.log("\nBooking submitted successfully!");
    process.exit(0);
  } else if (result.button === 'cancel') {
    console.log("✗ Booking cancelled");
    process.exit(1);
  } else {
    console.error("✗ No data received");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
