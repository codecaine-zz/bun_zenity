import { Zenity } from '../zenity-wrapper';

const zenity = new Zenity();

try {
  const result = await zenity.forms(
    [
      { type: 'entry', label: 'Full Name' },
      { type: 'combo', label: 'Age Group', values: ['18-25', '26-35', '36-45', '46-55', '56+'] },
      { type: 'combo', label: 'Education', values: ['High School', 'Bachelor', 'Master', 'PhD', 'Other'] },
      { type: 'combo', label: 'Employment', values: ['Employed', 'Self-Employed', 'Student', 'Retired', 'Unemployed'] }
    ],
    {
      title: "Survey Form",
      text: "Please complete this quick survey:",
      separator: "|",
      width: 500,
      height: 400
    }
  );

  if (result.button === 'ok' && result.values) {
    const [name, ageGroup, education, employment] = result.values;

    // Validation
    if (!name) {
      console.error("✗ Error: Name is required");
      process.exit(1);
    }

    console.log("\n✓ Survey Response:");
    console.log(`Name: ${name}`);
    console.log(`Age Group: ${ageGroup}`);
    console.log(`Education: ${education}`);
    console.log(`Employment Status: ${employment}`);
    console.log("\nThank you for completing the survey!");
    process.exit(0);
  } else if (result.button === 'cancel') {
    console.log("✗ Survey cancelled");
    process.exit(1);
  } else {
    console.error("✗ No data received");
    process.exit(1);
  }
} catch (error) {
  console.error(`Error: ${error}`);
  process.exit(1);
}
