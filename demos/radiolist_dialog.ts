import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  const size = await zenity.list(
    "Select your T-shirt size:",
    ["Select", "Size", "Chest (inches)", "Length (inches)"],
    [
      [false, "Small", "34-36", "27"],
      [true, "Medium", "38-40", "28"],
      [false, "Large", "42-44", "29"],
      [false, "X-Large", "46-48", "30"],
      [false, "XX-Large", "50-52", "31"],
    ],
    {
      title: "Size Selection",
      radiolist: true,
      width: 500,
      height: 350
    }
  );

  if (size) {
    console.log(`✓ Selected size: ${size}`);
    process.exit(0);
  } else {
    console.log("✗ No size selected");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
