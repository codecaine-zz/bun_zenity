# Bun Zenity Wrapper

A fully-typed TypeScript wrapper for Zenity dialogs, providing an easy-to-use API for creating native desktop dialogs in your Bun applications.

## Prerequisites

Install Zenity on your system:

```bash
# macOS
brew install zenity

# Ubuntu/Debian
sudo apt-get install zenity

# Fedora
sudo dnf install zenity
```

> **macOS Note:** This wrapper automatically configures Zenity to prevent GTK4-related crashes on macOS by setting the `GSETTINGS_BACKEND=memory` environment variable. No additional setup required!

## Installation

```bash
bun install
```

## Usage

```typescript
import Zenity from './zenity-wrapper';

const zenity = new Zenity();

// Show an info dialog
await zenity.info("Hello, World!", { title: "Greeting" });

// Ask a question
const confirm = await zenity.question("Continue?");
if (confirm) {
  console.log("User confirmed!");
}

// Get user input
const name = await zenity.entry("Enter your name:");
console.log(`Hello, ${name}!`);
```

## Screenshots

### Message Dialogs

<table>
<tr>
<td align="center">
<img src="screenshots/info_dialog.png" width="300" alt="Info Dialog"><br>
<b>Info Dialog</b>
</td>
<td align="center">
<img src="screenshots/warning_dialog.png" width="300" alt="Warning Dialog"><br>
<b>Warning Dialog</b>
</td>
</tr>
<tr>
<td align="center">
<img src="screenshots/error_dialog.png" width="300" alt="Error Dialog"><br>
<b>Error Dialog</b>
</td>
<td align="center">
<img src="screenshots/question-dialog.png" width="300" alt="Question Dialog"><br>
<b>Question Dialog</b>
</td>
</tr>
</table>

### Input Dialogs

<table>
<tr>
<td align="center">
<img src="screenshots/entry_dialog.png" width="300" alt="Entry Dialog"><br>
<b>Text Entry</b>
</td>
<td align="center">
<img src="screenshots/secret_encrty_dialog.png" width="300" alt="Password Dialog"><br>
<b>Password Entry</b>
</td>
</tr>
<tr>
<td align="center">
<img src="screenshots/scale_dialog.png" width="300" alt="Scale Dialog"><br>
<b>Scale/Slider</b>
</td>
<td align="center">
<img src="screenshots/calendar_dialog.png" width="300" alt="Calendar Dialog"><br>
<b>Calendar</b>
</td>
</tr>
</table>

### Selection Dialogs

<table>
<tr>
<td align="center">
<img src="screenshots/list_dialog.png" width="300" alt="List Dialog"><br>
<b>Single Selection List</b>
</td>
<td align="center">
<img src="screenshots/multiple_selection_list_dialog.png" width="300" alt="Multiple Selection List"><br>
<b>Multiple Selection List</b>
</td>
</tr>
</table>

### Form Dialogs

<table>
<tr>
<td align="center">
<img src="screenshots/user_info_form_dialog.png" width="300" alt="User Info Form"><br>
<b>User Info Form</b>
</td>
<td align="center">
<img src="screenshots/registration_form_dialog.png" width="300" alt="Registration Form"><br>
<b>Registration Form</b>
</td>
</tr>
<tr>
<td align="center">
<img src="screenshots/username_password.dialog.png" width="300" alt="Username/Password Form"><br>
<b>Login Form</b>
</td>
<td align="center">
<img src="screenshots/textarea_dialog.png" width="300" alt="Text Area Dialog"><br>
<b>Text Editor</b>
</td>
</tr>
<tr>
<td align="center">
<img src="screenshots/form_with_multientry_dialog.png" width="300" alt="Form with Multiline Entry"><br>
<b>Form with Multiline Entry</b>
</td>
<td align="center">
</td>
</tr>
</table>

### Controlling Multiline Input Height

When using forms with multiline text fields, you can control the height by setting the `height` option on the dialog. Zenity automatically distributes the available space among form fields, with multiline fields receiving proportionally more vertical space.

**How it works:**

- Single-line fields (entry, password, combo) have a fixed height
- Multiline fields expand to use the remaining available vertical space
- The `height` parameter controls the overall dialog height, not individual fields

**Example:**

```typescript
const zenity = new Zenity();

// Small multiline area (default height)
const result1 = await zenity.forms(
  [
    { type: 'entry', label: 'Title' },
    { type: 'multiline', label: 'Description' },
    { type: 'entry', label: 'Tags' }
  ],
  {
    text: "Create a Post",
    separator: "||"
  }
);

// Large multiline area (increased height)
const result2 = await zenity.forms(
  [
    { type: 'entry', label: 'Title' },
    { type: 'multiline', label: 'Description' },
    { type: 'entry', label: 'Tags' }
  ],
  {
    text: "Create a Post",
    separator: "||",
    width: 600,
    height: 800  // More dialog height = more space for multiline field
  }
);
```

**Note:** Zenity doesn't provide command-line options to control individual field heights. The layout is handled automatically based on the overall dialog dimensions.

## API Documentation

See [ZENITY_API.md](./ZENITY_API.md) for complete API documentation with examples for all dialog types.

## Running the Demo

```bash
bun run demo.ts
```

The demo showcases all available dialog types including:

- Message dialogs (info, warning, error, question)
- Input dialogs (entry, password, scale, calendar)
- Selection dialogs (list, color picker)
- File dialogs (open, save, directory)
- Progress dialogs
- Advanced dialogs (forms, text editor)

## Building

You can build your TypeScript files with Bun:

```bash
# Build a single file
bun build ./demo.ts --outdir ./dist

# Build with minification
bun build ./demo.ts --outdir ./dist --minify

# Build as a standalone executable
bun build ./demo.ts --compile --outfile zenity-demo
```

For more build options, see the [Bun build documentation](https://bun.sh/docs/bundler).

## TypeScript Support

This library is written in TypeScript and includes full type definitions. All dialog options are properly typed for an excellent development experience.

```typescript
import Zenity, { QuestionOptions, ListOptions } from './zenity-wrapper';

const options: QuestionOptions = {
  title: "Confirm",
  okLabel: "Yes",
  cancelLabel: "No"
};
```

## Related Projects

This Bun/TypeScript wrapper is inspired by the [Python Zenity Wrapper](https://github.com/codecaine-zz/python_zenity_wrapper), which provides similar functionality for Python applications. If you're working with Python instead of JavaScript/TypeScript, check it out!

## Project Info

This project was created using `bun init` in bun v1.3.2. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
