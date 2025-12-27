import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  await zenity.error(
    "This is an error message.\n\nError dialogs are used to notify users about errors or failures.",
    {
      title: "Error",
      width: 400
    }
  );
  console.log("✓ Error dialog displayed successfully!");
  process.exit(0);
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
