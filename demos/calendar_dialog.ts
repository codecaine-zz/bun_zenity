import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  // Get today's date
  const today = new Date();

  const date = await zenity.calendar(
    "Select your birth date:",
    {
      title: "Date Picker",
      day: 1,
      month: 1,
      year: 2000,
      dateFormat: "%Y-%m-%d"
    }
  );

  if (date) {
    console.log(`✓ Selected date: ${date}`);

    // Calculate age if valid date format
    try {
      const birthDate = new Date(date);
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      console.log(`Age: ${age} years old`);
      process.exit(0);
    } catch (e) {
      console.log(`Warning: Could not parse date: ${e}`);
      console.log(`Date selected: ${date}`);
      process.exit(0);
    }
  } else {
    console.log("✗ User cancelled");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
