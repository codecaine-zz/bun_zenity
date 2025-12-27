import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  await zenity.info(
    "This is an information message.\n\nInfo dialogs are used to display general information to the user.",
    {
      title: "Information",
      width: 400
    }
  );
  console.log("✓ Info dialog displayed successfully!");
  process.exit(0);
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
