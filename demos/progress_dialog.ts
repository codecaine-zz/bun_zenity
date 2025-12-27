import { Zenity } from '../zenity-wrapper';
import { sleep } from 'bun';

const zenity = new Zenity();

try {
  console.log("Demo 1: Percentage Progress");
  const progress = await zenity.progress(
    "Processing files...",
    {
      title: "Progress",
      percentage: 0,
      autoClose: true
    }
  );

  for (let i = 0; i <= 100; i += 10) {
    zenity.updateProgress(progress, i, `Processing... ${i}%`);
    await sleep(300);
  }

  if (progress.stdin) {
    progress.stdin.end();
  }
  await progress.exited;
  console.log("Progress complete!\n");

  // Ask if user wants to continue
  try {
    const cont = await zenity.question("Continue to pulsating progress demo?", { title: "Continue?" });
    if (!cont) process.exit(0);
  } catch {
    process.exit(0);
  }

  console.log("Demo 2: Pulsating Progress (indefinite)");
  const progress2 = await zenity.progress(
    "Please wait while we process your request...",
    {
      title: "Processing",
      pulsate: true,
      autoClose: true,
      noCancel: true
    }
  );

  // Simulate some work
  await sleep(3000);

  // Complete the progress
  if (progress2.stdin) {
    progress2.stdin.write("100\n");
    progress2.stdin.end();
  }
  await progress2.exited;
  console.log("✓ Processing complete!");
  process.exit(0);

} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
