import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  const toppings = await zenity.list(
    "Select your pizza toppings:",
    ["Select", "Topping", "Price", "Calories"],
    [
      [false, "Cheese", "$1.00", "100"],
      [true, "Pepperoni", "$2.00", "150"],
      [false, "Mushrooms", "$1.50", "20"],
      [false, "Olives", "$1.50", "30"],
      [false, "Onions", "$1.00", "15"],
      [false, "Bell Peppers", "$1.25", "25"],
    ],
    {
      title: "Pizza Toppings",
      checklist: true,
      multiple: true,
      width: 500,
      height: 400,
      separator: '|'
    }
  );

  if (toppings) {
    console.log(`✓ Selected toppings: ${toppings}`);
    if (Array.isArray(toppings)) {
      console.log(`Total selections: ${toppings.length}`);
    } else {
      console.log(`Selected: ${toppings}`);
    }
    process.exit(0);
  } else {
    console.log("✗ No toppings selected");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
