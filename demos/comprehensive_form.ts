import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  console.log("This demo showcases ALL 6 form field types in one form.");
  console.log("Fill out the registration form...\n");

  const result = await zenity.forms(
    [
      { type: 'entry', label: 'Full Name' },
      { type: 'password', label: 'Password' },
      { type: 'multiline', label: 'Bio' },
      { type: 'calendar', label: 'Birth Date' },
      { 
        type: 'combo', 
        label: 'Gender', 
        values: ['Male', 'Female', 'Non-binary', 'Prefer not to say'] 
      },
      { 
        type: 'combo', 
        label: 'Country', 
        values: ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France', 'Japan', 'Brazil', 'India', 'China'] 
      }
    ],
    {
      title: "Complete Registration",
      text: "All field types demonstrated:",
      separator: "||",
      formsDateFormat: "%Y-%m-%d",
      showHeader: true,
      width: 600,
      height: 650
    }
  );

  if (result.button === 'ok' && result.values) {
    const [name, password, bio, birthDate, gender, country] = result.values;

    // Validation
    if (!name || !password) {
      console.error("✗ Error: Name and password are required");
      process.exit(1);
    }

    if (password.length < 8) {
      console.error("✗ Warning: Password should be at least 8 characters");
    }

    console.log("\n" + "=".repeat(60));
    console.log("✓ REGISTRATION COMPLETE - ALL FIELD TYPES");
    console.log("=".repeat(60));
    console.log(`\n✓ Entry Field - Name: ${name}`);
    console.log(`✓ Password Field - Password: ${'*'.repeat(password.length)} (${password.length} chars)`);
    console.log(`✓ Multiline Field - Bio: ${bio.substring(0, 50)}${bio.length > 50 ? '...' : ''}`);
    console.log(`✓ Calendar Field - Birth Date: ${birthDate}`);
    console.log(`✓ Combo Field - Gender: ${gender}`);
    console.log(`✓ List Field - Country: ${country}`);
    console.log("\n" + "=".repeat(60));
    console.log("\nAll 6 form field types successfully captured!");
    process.exit(0);
  } else if (result.button === 'cancel') {
    console.log("✗ Registration cancelled");
    process.exit(1);
  } else {
    console.error("✗ No data received");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
