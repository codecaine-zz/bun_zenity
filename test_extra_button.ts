#!/usr/bin/env bun
/**
 * Test to demonstrate distinguishing between Cancel and Extra button in forms
 */

import Zenity from 'zenity-wrapper';

const zenity = new Zenity();

console.log("Testing forms with extra button...\n");

// Test form with an extra button
const result = await zenity.forms(
  [
    { type: 'entry', label: 'Name' },
    { type: 'entry', label: 'Email' },
    { type: 'combo', label: 'Role', values: ['Developer', 'Designer', 'Manager'] }
  ],
  {
    title: 'User Information',
    extraButton: 'Skip',
    cancelLabel: 'Cancel',
    okLabel: 'Submit'
  }
);

console.log("\nForm result:");
console.log("Button clicked:", result.button);
console.log("Values:", result.values);

// Demonstrate different handling based on button
if (result.button === 'ok') {
  console.log("\n✓ User submitted the form");
  console.log("Name:", result.values?.[0]);
  console.log("Email:", result.values?.[1]);
  console.log("Role:", result.values?.[2]);
} else if (result.button === 'extra') {
  console.log("\n⊘ User clicked 'Skip'");
  console.log("Note: Zenity does not return form values when extra button is clicked");
  console.log("You can use this to trigger alternative actions (e.g., save a reminder)");
} else if (result.button === 'cancel') {
  console.log("\n✗ User cancelled the form");
}
