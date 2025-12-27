import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  console.log("Demo 1: Open single file");
  const filePath = await zenity.fileSelection({
    title: "Select a File"
  });

  if (filePath) {
    console.log(`Selected file: ${filePath}`);
  } else {
    console.log("No file selected");
  }

  // Ask if user wants to continue
  try {
    const cont = await zenity.question("Continue to multiple file selection?", { title: "Continue?" });
    if (!cont) process.exit(0);
  } catch {
    process.exit(0);
  }

  console.log("\nDemo 2: Open multiple files");
  const files = await zenity.fileSelection({
    title: "Select Multiple Files",
    multiple: true,
    separator: "|"
  });

  if (files) {
    console.log(`Selected ${Array.isArray(files) ? files.length : 1} file(s):`);
    if (Array.isArray(files)) {
      files.forEach(f => console.log(`  - ${f}`));
    } else {
      console.log(`  - ${files}`);
    }
  } else {
    console.log("No files selected");
  }

  // Ask if user wants to continue
  try {
    const cont = await zenity.question("Continue to directory selection?", { title: "Continue?" });
    if (!cont) process.exit(0);
  } catch {
    process.exit(0);
  }

  console.log("\nDemo 3: Select directory");
  const directory = await zenity.fileSelection({
    title: "Select a Directory",
    directory: true
  });

  if (directory) {
    console.log(`Selected directory: ${directory}`);
  } else {
    console.log("No directory selected");
  }

  // Ask if user wants to continue
  try {
    const cont = await zenity.question("Continue to save file dialog?", { title: "Continue?" });
    if (!cont) process.exit(0);
  } catch {
    process.exit(0);
  }

  console.log("\nDemo 4: Save file");
  const savePath = await zenity.fileSelection({
    title: "Save File As",
    save: true,
    filename: "document.txt",
    confirmOverwrite: true
  });

  if (savePath) {
    console.log(`✓ Save file to: ${savePath}`);
    process.exit(0);
  } else {
    console.log("✗ Save cancelled");
    process.exit(1);
  }

} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
