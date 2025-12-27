import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  const fruit = await zenity.list(
    "Choose your favorite fruit:",
    ["Fruit", "Color", "Calories"],
    [
      ["Apple", "Red", "95"],
      ["Banana", "Yellow", "105"],
      ["Orange", "Orange", "62"],
      ["Grape", "Purple", "62"],
      ["Strawberry", "Red", "49"]
    ],
    {
      title: "Fruit Selection",
      width: 500,
      height: 300
    }
  );

  if (fruit) {
    console.log(`✓ You selected: ${fruit}`);
    process.exit(0);
  } else {
    console.log("✗ No selection made");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
