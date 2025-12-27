import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  const answer = await zenity.question(
    "Do you want to proceed with this operation?",
    {
      title: "Confirmation",
      okLabel: "Yes, Proceed",
      cancelLabel: "No, Cancel"
    }
  );

  if (answer) {
    console.log("✓ User clicked: Yes, Proceed");
    process.exit(0);
  } else {
    console.log("✗ User clicked: No, Cancel");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
