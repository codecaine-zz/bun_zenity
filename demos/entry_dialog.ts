import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  const name = await zenity.entry(
    "Please enter your full name:",
    {
      title: "Text Input",
      entryText: "John Doe"
    }
  );

  if (name) {
    console.log(`✓ User entered: ${name}`);
    process.exit(0);
  } else {
    console.log("✗ User cancelled the dialog");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
