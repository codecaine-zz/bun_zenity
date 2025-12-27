import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  const result = await zenity.forms(
    [
      { type: 'entry', label: 'First Name' },
      { type: 'entry', label: 'Last Name' },
      { type: 'entry', label: 'Email' }
    ],
    {
      title: "Contact Information",
      text: "Please enter your contact details:",
      separator: "|",
      width: 500
    }
  );

  if (result.button === 'ok' && result.values) {
    const [firstName, lastName, email] = result.values;

    // Basic validation
    if (!firstName || !lastName) {
      console.error("✗ Error: First name and last name are required");
      process.exit(1);
    }

    if (email && !email.includes('@')) {
      console.error("✗ Warning: Email appears to be invalid");
    }

    console.log("\n✓ Form submitted successfully!");
    console.log(`First Name: ${firstName}`);
    console.log(`Last Name: ${lastName}`);
    console.log(`Email: ${email}`);
    process.exit(0);
  } else if (result.button === 'cancel') {
    console.log("✗ Form cancelled by user");
    process.exit(1);
  } else {
    console.error("✗ No data received");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
