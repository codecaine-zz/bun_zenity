import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  const result = await zenity.forms(
    [
      { type: 'entry', label: 'Username' },
      { type: 'password', label: 'Password' },
      { type: 'password', label: 'Confirm Password' }
    ],
    {
      title: "User Registration",
      text: "Create your account:",
      separator: "|",
      width: 450
    }
  );

  if (result.button === 'ok' && result.values) {
    const [username, password, confirm] = result.values;

    // Validation
    if (!username || !password || !confirm) {
      console.error("✗ Error: All fields are required");
      process.exit(1);
    }

    if (password.length < 8) {
      console.error("✗ Error: Password must be at least 8 characters");
      process.exit(1);
    }

    console.log("\n✓ Registration Form Submitted");
    console.log(`Username: ${username}`);
    console.log(`Password: ${'*'.repeat(password.length)} (${password.length} characters)`);
    console.log(`Confirm: ${'*'.repeat(confirm.length)} (${confirm.length} characters)`);

    if (password === confirm) {
      console.log("\n✓ Passwords match!");
      process.exit(0);
    } else {
      console.error("\n✗ Passwords do not match!");
      process.exit(1);
    }
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
