# Zenity Wrapper API Documentation

A comprehensive TypeScript/JavaScript wrapper for Zenity dialogs, making it easy to create native desktop dialogs in your applications.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [API Reference](#api-reference)
  - [Message Dialogs](#message-dialogs)
  - [Input Dialogs](#input-dialogs)
  - [Selection Dialogs](#selection-dialogs)
  - [File Dialogs](#file-dialogs)
  - [Progress Dialogs](#progress-dialogs)
  - [Advanced Dialogs](#advanced-dialogs)

---

## Installation

```bash
npm install zenity-wrapper
# or
bun add zenity-wrapper
# or simply copy zenity-wrapper.ts into your project
```

**Prerequisites:** Zenity must be installed on your system.

```bash
# macOS
brew install zenity

# Ubuntu/Debian
sudo apt-get install zenity

# Fedora
sudo dnf install zenity
```

> **Note for macOS users:** This wrapper automatically sets the `GSETTINGS_BACKEND=memory` environment variable to prevent GTK4 Zenity crashes on macOS. No additional configuration is needed.

---

## Basic Usage

```typescript
import Zenity from './zenity-wrapper';

const zenity = new Zenity();

// Simple info dialog
await zenity.info("Hello, World!", { title: "Greeting" });

// Question dialog
const answer = await zenity.question("Do you want to continue?");
console.log(answer); // true or false

// Get user input
const name = await zenity.entry("Enter your name:");
if (name) {
  console.log(`Hello, ${name}!`);
}

// With TypeScript types
import { QuestionOptions } from './zenity-wrapper';

const options: QuestionOptions = {
  title: "Confirm",
  okLabel: "Yes",
  cancelLabel: "No"
};
const result = await zenity.question("Are you sure?", options);
```

---

## API Reference

### Message Dialogs

#### `info(text: string, options?: InfoOptions): Promise<void>`

Displays an information dialog.

**Parameters:**
- `text` - The message to display
- `options` (optional):
  - `title?: string` - Dialog window title
  - `width?: number` - Dialog width in pixels
  - `height?: number` - Dialog height in pixels
  - `timeout?: number` - Auto-close after N seconds
  - `noWrap?: boolean` - Disable text wrapping
  - `noMarkup?: boolean` - Disable Pango markup
  - `ellipsize?: boolean` - Enable text ellipsization
  - `iconName?: string` - Custom icon name

**Example:**
```typescript
await zenity.info("Operation completed successfully", {
  title: "Success",
  timeout: 5
});
```

---

#### `warning(text: string, options?: WarningOptions): Promise<void>`

Displays a warning dialog.

**Parameters:**
- `text` - The warning message
- `options` - Same as `info()`

**Example:**
```typescript
await zenity.warning("Low disk space detected", {
  title: "Warning"
});
```

---

#### `error(text: string, options?: ErrorOptions): Promise<void>`

Displays an error dialog.

**Parameters:**
- `text` - The error message
- `options` - Same as `info()`

**Example:**
```typescript
await zenity.error("Failed to save file", {
  title: "Error"
});
```

---

#### `question(text: string, options?: QuestionOptions): Promise<boolean>`

Displays a question dialog with OK/Cancel buttons.

**Parameters:**
- `text` - The question text
- `options` (optional):
  - All `info()` options, plus:
  - `okLabel?: string` - Custom OK button label
  - `cancelLabel?: string` - Custom Cancel button label
  - `defaultCancel?: boolean` - Make Cancel the default button

**Returns:** `true` if OK clicked, `false` if cancelled

**Example:**
```typescript
const confirm = await zenity.question("Delete this file?", {
  title: "Confirm Deletion",
  okLabel: "Delete",
  cancelLabel: "Keep"
});

if (confirm) {
  // Delete the file
}
```

---

### Input Dialogs

#### `entry(text: string, options?: EntryOptions): Promise<string | null>`

Displays a text entry dialog.

**Parameters:**
- `text` - The prompt text
- `options` (optional):
  - All common options, plus:
  - `entryText?: string` - Default/placeholder text
  - `hideText?: boolean` - Hide input (for passwords)

**Returns:** The entered text, or `null` if cancelled

**Example:**
```typescript
const name = await zenity.entry("Enter your name:", {
  entryText: "John Doe"
});

if (name) {
  console.log(`Hello, ${name}!`);
}
```

---

#### `password(options?: PasswordOptions): Promise<string | null>`

Displays a password entry dialog.

**Parameters:**
- `options` (optional):
  - All common options, plus:
  - `username?: boolean` - Also prompt for username

**Returns:** The password, or `username|password` if username option is enabled

**Example:**
```typescript
// Simple password
const pwd = await zenity.password();

// With username
const credentials = await zenity.password({ username: true });
// Returns: "user|password"
```

---

#### `scale(text: string, options?: ScaleOptions): Promise<number | null>`

Displays a slider/scale dialog.

**Parameters:**
- `text` - The prompt text
- `options` (optional):
  - All common options, plus:
  - `value?: number` - Initial value (default: 0)
  - `minValue?: number` - Minimum value (default: 0)
  - `maxValue?: number` - Maximum value (default: 100)
  - `step?: number` - Step increment (default: 1)
  - `hideValue?: boolean` - Hide the current value display
  - `printPartial?: boolean` - Print value changes to stdout

**Returns:** The selected number, or `null` if cancelled

**Example:**
```typescript
const volume = await zenity.scale("Adjust volume:", {
  value: 50,
  minValue: 0,
  maxValue: 100,
  step: 5
});

console.log(`Volume set to: ${volume}`);
```

---

#### `calendar(text: string, options?: CalendarOptions): Promise<string | null>`

Displays a calendar date picker.

**Parameters:**
- `text` - The prompt text
- `options` (optional):
  - All common options, plus:
  - `day?: number` - Pre-selected day (1-31)
  - `month?: number` - Pre-selected month (1-12)
  - `year?: number` - Pre-selected year
  - `dateFormat?: string` - Output format (default: "%Y-%m-%d")

**Returns:** The selected date as a formatted string, or `null` if cancelled

**Example:**
```typescript
const date = await zenity.calendar("Select your birthday:", {
  day: 1,
  month: 1,
  year: 2000,
  dateFormat: "%Y-%m-%d"
});

console.log(`Birthday: ${date}`);
```

**Date Format Specifiers:**
- `%Y` - Year (4 digits)
- `%m` - Month (01-12)
- `%d` - Day (01-31)
- `%B` - Full month name
- `%A` - Full weekday name
- See `strftime` documentation for more format options

---

### Selection Dialogs

#### `list(text: string, columns: string[], data: any[][], options?: ListOptions): Promise<string | string[] | null>`

Displays a list selection dialog with various modes.

**Parameters:**
- `text` - The prompt text
- `columns` - Array of column headers
- `data` - 2D array of row data
- `options` (optional):
  - All common options, plus:
  - `checklist?: boolean` - Enable checklist mode (first column is boolean)
  - `radiolist?: boolean` - Enable radio list mode (first column is boolean)
  - `multiple?: boolean` - Allow multiple selections
  - `editable?: boolean` - Allow editing cells
  - `separator?: string` - Custom separator for output (default: "|")
  - `column?: number` - Column to print (default: all)
  - `hideHeader?: boolean` - Hide column headers
  - `printColumn?: number` - Specific column to print

**Returns:** 
- Single selection: `string` (selected value)
- Multiple selections: `string[]` (array of values)
- Cancelled: `null`

**Examples:**

**Simple List:**
```typescript
const fruit = await zenity.list(
  "Choose a fruit:",
  ["Fruit"],
  [["Apple"], ["Banana"], ["Orange"]]
);
```

**Checklist:**
```typescript
const selected = await zenity.list(
  "Select toppings:",
  ["Select", "Topping", "Price"],
  [
    [false, "Cheese", "$1"],
    [true, "Pepperoni", "$2"],
    [false, "Mushrooms", "$1.50"]
  ],
  { checklist: true, multiple: true }
);
// Returns: ["Pepperoni"] (if user keeps default selection)
```

**Radio List:**
```typescript
const size = await zenity.list(
  "Select size:",
  ["Select", "Size"],
  [
    [false, "Small"],
    [true, "Medium"],
    [false, "Large"]
  ],
  { radiolist: true }
);
```

---

#### `colorSelection(options?: ColorSelectionOptions): Promise<string | null>`

Displays a color picker dialog.

> **⚠️ macOS Compatibility:** The color selection dialog does not work on macOS due to limitations in the Zenity GTK implementation. Consider using alternative color picker solutions on macOS.

**Parameters:**
- `options` (optional):
  - All common options, plus:
  - `color?: string` - Initial color in hex format (e.g., "#FF5733") or rgb format (e.g., "rgb(255,87,51)")
  - `showPalette?: boolean` - Show color palette

**Returns:** Selected color in rgb format (e.g., "rgb(255,87,51)"), or `null` if cancelled

**Note:** The wrapper automatically converts hex colors to the RGB format required by Zenity (16-bit values 0-65535).

**Example:**
```typescript
const color = await zenity.colorSelection({
  color: "#FF5733",
  showPalette: true
});

console.log(`Selected color: ${color}`);
```

---

### File Dialogs

#### `fileSelection(options?: FileSelectionOptions): Promise<string | string[] | null>`

Displays a file or directory selection dialog.

**Parameters:**
- `options` (optional):
  - All common options, plus:
  - `multiple?: boolean` - Allow multiple file selection
  - `directory?: boolean` - Select directories instead of files
  - `save?: boolean` - Show save dialog instead of open
  - `separator?: string` - Separator for multiple files (default: "|")
  - `filename?: string` - Default filename for save dialog
  - `confirmOverwrite?: boolean` - Confirm before overwriting in save mode

**Returns:**
- Single file: `string` (file path)
- Multiple files: `string[]` (array of file paths)
- Cancelled: `null`

**Examples:**

**Open File:**
```typescript
const file = await zenity.fileSelection();
```

**Open Multiple Files:**
```typescript
const files = await zenity.fileSelection({
  multiple: true,
  separator: "|"
});
```

**Select Directory:**
```typescript
const dir = await zenity.fileSelection({
  directory: true
});
```

**Save File:**
```typescript
const savePath = await zenity.fileSelection({
  save: true,
  confirmOverwrite: true,
  filename: "document.txt"
});
```

---

### Progress Dialogs

#### `progress(text: string, options?: ProgressOptions): Promise<Subprocess>`

Displays a progress dialog.

**Parameters:**
- `text` - The progress message
- `options` (optional):
  - All common options, plus:
  - `percentage?: number` - Initial percentage (0-100)
  - `pulsate?: boolean` - Show pulsating progress bar
  - `autoClose?: boolean` - Auto-close when 100% reached
  - `autoKill?: boolean` - Auto-kill when window is closed
  - `noCancel?: boolean` - Hide cancel button
  - `timeRemaining?: boolean` - Show estimated time remaining

**Returns:** A Bun `Subprocess` object with `stdin` and `exited` properties

**Usage:**
- Write percentage to stdin: `process.stdin.write("50\n")`
- Update message: `process.stdin.write("# Loading...\n")`
- Complete: `process.stdin.end()`

**Examples:**

**Percentage Progress:**
```typescript
const progress = await zenity.progress("Loading...", {
  percentage: 0,
  autoClose: true
});

for (let i = 0; i <= 100; i += 10) {
  progress.stdin.write(`${i}\n`);
  progress.stdin.write(`# Processing ${i}%\n`);
  await new Promise(r => setTimeout(r, 500));
}

progress.stdin.end();
await progress.exited;
```

**Pulsating Progress:**
```typescript
const progress = await zenity.progress("Processing...", {
  pulsate: true,
  autoClose: true,
  noCancel: true
});

// Do work...
setTimeout(() => {
  progress.stdin.write("100\n");
  progress.stdin.end();
}, 3000);

await progress.exited;
```

#### `updateProgress(process: Subprocess, percentage: number, text?: string): void`

Helper method to update a progress dialog.

**Parameters:**
- `process` - The process object returned by `progress()`
- `percentage` - Progress percentage (0-100)
- `text` - Optional text to update the progress message

**Example:**
```typescript
const progress = await zenity.progress("Loading...", {
  percentage: 0,
  autoClose: true
});

// Using the helper method
zenity.updateProgress(progress, 25, "Processing files...");
zenity.updateProgress(progress, 50, "Half way there...");
zenity.updateProgress(progress, 100, "Complete!");

progress.stdin.end();
await progress.exited;
```

---

### Advanced Dialogs

#### `forms(fields: FormField[], options?: FormsOptions): Promise<string[] | null>`

Displays a multi-field form dialog.

**Parameters:**
- `fields` - Array of form fields:
  - `{ type: 'entry', label: string }` - Single-line text entry field
  - `{ type: 'password', label: string }` - Password field (hidden text)
  - `{ type: 'multiline', label: string }` - Multi-line text entry field (Since Zenity 4.2)
  - `{ type: 'calendar', label: string }` - Date picker
  - `{ type: 'list', label: string, header?: string, values?: string[], columnValues?: string[] }` - List field with optional header and values
  - `{ type: 'combo', label: string, values?: string[] }` - Combo box (dropdown) field
- `options` (optional):
  - All common options, plus:
  - `text?: string` - Form title/description text
  - `separator?: string` - Field separator in output (default: "|")
  - `formsDateFormat?: string` - Date format for calendar fields (e.g., "%Y-%m-%d")
  - `showHeader?: boolean` - Show column headers for list fields

**Returns:** Array of values (one per field), or `null` if cancelled

**Examples:**

**Basic Form:**
```typescript
const data = await zenity.forms(
  [
    { type: 'entry', label: 'Full Name' },
    { type: 'entry', label: 'Email' },
    { type: 'password', label: 'Password' }
  ],
  { 
    text: "User Registration",
    separator: "|" 
  }
);

if (data) {
  const [name, email, password] = data;
  console.log({ name, email, password });
}
```

**Advanced Form with All Field Types:**
```typescript
const data = await zenity.forms(
  [
    { type: 'entry', label: 'Username' },
    { type: 'password', label: 'Password' },
    { type: 'multiline', label: 'Bio' },
    { type: 'calendar', label: 'Birth Date' },
    { 
      type: 'combo', 
      label: 'Gender', 
      values: ['Male', 'Female', 'Other', 'Prefer not to say'] 
    },
    { 
      type: 'list', 
      label: 'Country',
      header: 'Select Country',
      values: ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France']
    }
  ],
  {
    text: "Complete Registration",
    separator: "|",
    formsDateFormat: "%Y-%m-%d",
    showHeader: true
  }
);

if (data) {
  const [username, password, bio, birthDate, gender, country] = data;
  console.log({ username, password, bio, birthDate, gender, country });
}
```

---

#### `text(text: string, options?: TextOptions): Promise<string | null>`

Displays a text information dialog with optional editing.

**Parameters:**
- `text` - The text to display
- `options` (optional):
  - All common options, plus:
  - `filename?: string` - Load text from file
  - `editable?: boolean` - Allow editing the text
  - `fontName?: string` - Custom font name
  - `checkbox?: string` - Add checkbox with label
  - `htmlMode?: boolean` - Enable HTML rendering (if supported)
  - `url?: string` - Load content from URL
  - `autoScroll?: boolean` - Auto-scroll to bottom

**Returns:** The (possibly edited) text, or `null` if cancelled

**Examples:**

**Display Text:**
```typescript
const result = await zenity.text(
  "This is some information.\n\nRead-only text display."
);
```

**Editable Text:**
```typescript
const editedText = await zenity.text(
  "Edit this content...",
  { editable: true }
);

if (editedText) {
  console.log("User entered:", editedText);
}
```

**Load from File:**
```typescript
const content = await zenity.text("", {
  filename: "/path/to/file.txt",
  editable: true
});
```

---

## Common Options

All dialog methods support these common options:

```typescript
interface CommonOptions {
  title?: string;           // Window title
  width?: number;           // Window width in pixels
  height?: number;          // Window height in pixels
  timeout?: number;         // Auto-close timeout in seconds
  okLabel?: string;         // Custom OK button label
  cancelLabel?: string;     // Custom Cancel button label
  extraButton?: string;     // Add extra button with label
  modalHint?: boolean;      // Set modal hint
  attachParent?: number;    // Attach to parent window (XID)
}
```

---

## Error Handling

All methods can throw errors if Zenity is not installed or if there's a system error:

```typescript
try {
  const result = await zenity.info("Hello!");
} catch (error) {
  console.error("Dialog error:", error);
}
```

When a user cancels a dialog, the method returns `null` (not an error).

---

## Type Definitions

The wrapper is fully typed for TypeScript. Import types as needed:

```typescript
import Zenity, { 
  // Common options
  CommonOptions,
  
  // Message dialog options
  InfoOptions, 
  WarningOptions,
  ErrorOptions,
  QuestionOptions,
  
  // Input dialog options
  EntryOptions,
  PasswordOptions,
  ScaleOptions,
  CalendarOptions,
  
  // Selection dialog options
  ListOptions,
  ColorSelectionOptions,
  
  // File dialog options
  FileSelectionOptions,
  
  // Progress dialog options
  ProgressOptions,
  
  // Advanced dialog options
  FormField,
  FormsOptions,
  TextOptions
} from './zenity-wrapper';
```

### Type Interfaces

**CommonOptions** - Shared by all dialogs:
```typescript
interface CommonOptions {
  title?: string;
  width?: number;
  height?: number;
  timeout?: number;
  okLabel?: string;
  cancelLabel?: string;
  extraButton?: string;
  modalHint?: boolean;
  attachParent?: number;
}
```

**FormField** - Union type for form fields:

```typescript
type FormField = 
  | { type: 'entry'; label: string; value?: string }
  | { type: 'password'; label: string }
  | { type: 'multiline'; label: string; value?: string }
  | { type: 'calendar'; label: string }
  | { type: 'list'; label: string; header?: string; values?: string[]; columnValues?: string[] }
  | { type: 'combo'; label: string; values?: string[] };
```

---

## License

MIT

---

## Contributing

Contributions are welcome! Please ensure all dialogs are tested with Zenity installed.
