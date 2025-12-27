import { Zenity } from './zenity-wrapper';
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

const zenity = new Zenity();
const demosDir = join(import.meta.dir, 'demos');

async function getDemoFiles() {
  try {
    const files = await readdir(demosDir);
    return files.filter(file => file.endsWith('.ts')).sort();
  } catch (error) {
    console.error(`Error reading demos directory: ${error}`);
    return [];
  }
}

async function runDemo(filename: string) {
  const filePath = join(demosDir, filename);
  console.log(`\nRunning demo: ${filename}...`);
  
  const proc = Bun.spawn(['bun', 'run', filePath], {
    stdio: ['inherit', 'inherit', 'inherit']
  });
  
  await proc.exited;
  console.log(`\nDemo ${filename} finished.`);
}

async function main() {
  try {
    const demoFiles = await getDemoFiles();
    
    if (demoFiles.length === 0) {
      await zenity.error("No demo files found in the 'demos' directory.", { title: "Error" });
      return;
    }

    while (true) {
      // Prepare list items for Zenity
      // We need a 2D array where each inner array represents a row
      // Columns: [Filename, Description]
      const listItems = demoFiles.map(file => {
        // Create a simple description based on filename
        let description = file.replace('.ts', '').replace(/_/g, ' ');
        description = description.charAt(0).toUpperCase() + description.slice(1);
        return [file, description];
      });

      const selected = await zenity.list(
        "Select a demo to run:",
        ["Filename", "Description"],
        listItems,
        {
          title: "Zenity Wrapper Demos Launcher",
          width: 600,
          height: 500,
          okLabel: "Run Demo",
          cancelLabel: "Exit",
        }
      );

      if (!selected) {
        console.log("Exiting demo launcher.");
        break;
      }

      // selected will be the filename string (e.g., "info_dialog.ts")
      // because Zenity returns the first column by default unless printColumn is specified.
      
      await runDemo(selected as string);
    }

  } catch (error) {
    console.error(`An error occurred: ${error}`);
    await zenity.error(`An error occurred: ${error}`, { title: "Error" });
  }
}

main();
