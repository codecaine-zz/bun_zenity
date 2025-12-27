import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  await zenity.warning(
    "This is a warning message.\n\nWarning dialogs are used to alert users about potential issues.",
    {
      title: "Warning",
      width: 400
    }
  );
  console.log("✓ Warning dialog displayed successfully!");
  process.exit(0);
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
