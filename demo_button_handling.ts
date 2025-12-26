#!/usr/bin/env bun
/**
 * Comprehensive demo showing the difference between OK, Cancel, and Extra buttons in forms
 */

import Zenity from './zenity-wrapper';

const zenity = new Zenity();

console.log("=".repeat(60));
console.log("Forms Button Differentiation Demo");
console.log("=".repeat(60));
console.log("\nThis demo shows how to distinguish between three buttons:");
console.log("  • OK (Submit) - User completes and submits the form");
console.log("  • Cancel - User cancels the operation");
console.log("  • Extra (Skip) - User wants to skip or perform alternative action");
console.log("\nTry clicking different buttons to see how they're handled!\n");

const result = await zenity.forms(
  [
    { type: 'entry', label: 'Full Name' },
    { type: 'entry', label: 'Email Address' },
    { type: 'combo', label: 'Department', values: ['Engineering', 'Design', 'Marketing', 'Sales'] },
    { type: 'combo', label: 'Experience Level', values: ['Junior', 'Mid', 'Senior', 'Lead'] }
  ],
  {
    title: 'Employee Onboarding',
    text: 'Please fill in your information',
    okLabel: 'Submit',
    cancelLabel: 'Cancel',
    extraButton: 'Fill Later',
    width: 400
  }
);

console.log("\n" + "=".repeat(60));
console.log("Result Analysis:");
console.log("=".repeat(60));
console.log(`Button clicked: ${result.button.toUpperCase()}`);
console.log(`Values returned: ${result.values ? 'Yes' : 'No'}`);
console.log("-".repeat(60));

// Handle each button case differently
switch (result.button) {
  case 'ok':
    console.log("\n✅ SUCCESS: User submitted the form");
    if (result.values) {
      console.log("\nEmployee Information:");
      console.log(`  Name: ${result.values[0]}`);
      console.log(`  Email: ${result.values[1]}`);
      console.log(`  Department: ${result.values[2]}`);
      console.log(`  Level: ${result.values[3]}`);
      console.log("\n→ Action: Saving to database and sending welcome email...");
    }
    break;

  case 'extra':
    console.log("\n⏭️  DEFERRED: User chose to fill the form later");
    console.log("\nNote: Zenity does not provide form values when extra button is clicked.");
    console.log("This is by design - the extra button is meant for alternative actions,");
    console.log("not partial form submission.");
    console.log("\n→ Action: Creating reminder to complete profile later...");
    console.log("→ Action: Sending notification email with form link...");
    break;

  case 'cancel':
    console.log("\n❌ CANCELLED: User cancelled the operation");
    console.log("→ Action: No data saved, returning to main menu...");
    break;
}

console.log("\n" + "=".repeat(60));
console.log("Demo Complete");
console.log("=".repeat(60));
