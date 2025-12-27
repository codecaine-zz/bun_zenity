import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

const sampleText = `Python Zenity Wrapper - Text Dialog Demo

This is a text dialog that can display large amounts of text.

Features:
- Display formatted text
- Scrollable content
- Optional editing mode
- Can load from files

This demo shows the text in editable mode.
Feel free to modify this text and click OK to see your changes!

Tips:
1. Use Ctrl+A to select all
2. Use Ctrl+C to copy
3. Use Ctrl+V to paste
4. Edit the text and click OK to submit

The text dialog is perfect for:
• Displaying license agreements
• Showing logs or reports
• Editing configuration files
• Viewing README files
`;

try {
  const editedText = await zenity.text(
    sampleText,
    {
      title: "Text Editor Demo",
      editable: true,
      width: 600,
      height: 500
    }
  );

  if (editedText) {
    if (editedText !== sampleText) {
      console.log("✓ Text was modified!");
      console.log(`\nNew text (${editedText.length} characters):`);
      console.log("-".repeat(60));
      console.log(editedText.length > 200 ? editedText.substring(0, 200) + "..." : editedText);
      console.log("-".repeat(60));
      process.exit(0);
    } else {
      console.log("✓ Text was not modified");
      process.exit(0);
    }
  } else {
    console.log("✗ Dialog was cancelled");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
