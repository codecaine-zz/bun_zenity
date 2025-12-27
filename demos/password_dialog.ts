import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  console.log("Demo 1: Simple password entry");
  const password = await zenity.password({
    title: "Enter Password"
  });

  if (password) {
    console.log(`✓ Password entered (length: ${password.length} characters)`);
  } else {
    console.log("✗ User cancelled");
    process.exit(1);
  }

  console.log("\nDemo 2: Username + Password entry");
  const credentials = await zenity.password({
    username: true,
    title: "Login Credentials"
  });

  if (credentials) {
    if (credentials.includes('|')) {
      const [username, pwd] = credentials.split('|', 2);
      console.log(`✓ Username: ${username}`);
      console.log(`✓ Password: (length: ${pwd.length} characters)`);
      process.exit(0);
    } else {
      console.log(`✓ Credentials entered: ${credentials}`);
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
