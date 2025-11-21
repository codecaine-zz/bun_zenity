# Zenity Wrapper API Documentation (Python)

A comprehensive Python wrapper for Zenity dialogs, making it easy to create native desktop dialogs in your applications.

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
# Simply copy zenity-wrapper.py into your project
cp zenity-wrapper.py /path/to/your/project/
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

```python
from zenity_wrapper import Zenity, InfoOptions, QuestionOptions

zenity = Zenity()

# Simple info dialog
zenity.info("Hello, World!", InfoOptions(title="Greeting"))

# Question dialog
answer = zenity.question("Do you want to continue?")
print(answer)  # True or False

# Get user input
name = zenity.entry("Enter your name:")
if name:
    print(f"Hello, {name}!")

# With options
options = QuestionOptions(
    title="Confirm",
    ok_label="Yes",
    cancel_label="No"
)
result = zenity.question("Are you sure?", options)
```

---

## API Reference

### Message Dialogs

#### `info(text: str, options: Optional[InfoOptions] = None) -> None`

Displays an information dialog.

**Parameters:**
- `text` - The message to display
- `options` (optional):
  - `title: str` - Dialog window title
  - `width: int` - Dialog width in pixels
  - `height: int` - Dialog height in pixels
  - `timeout: int` - Auto-close after N seconds
  - `no_wrap: bool` - Disable text wrapping
  - `no_markup: bool` - Disable Pango markup
  - `ellipsize: bool` - Enable text ellipsization
  - `icon_name: str` - Custom icon name

**Example:**
```python
from zenity_wrapper import Zenity, InfoOptions

zenity = Zenity()
zenity.info("Operation completed successfully", InfoOptions(
    title="Success",
    timeout=5
))
```

---

#### `warning(text: str, options: Optional[InfoOptions] = None) -> None`

Displays a warning dialog.

**Parameters:**
- `text` - The warning message
- `options` - Same as `info()`

**Example:**
```python
zenity.warning("Low disk space detected", InfoOptions(title="Warning"))
```

---

#### `error(text: str, options: Optional[InfoOptions] = None) -> None`

Displays an error dialog.

**Parameters:**
- `text` - The error message
- `options` - Same as `info()`

**Example:**
```python
zenity.error("Failed to save file", InfoOptions(title="Error"))
```

---

#### `question(text: str, options: Optional[QuestionOptions] = None) -> bool`

Displays a question dialog with OK/Cancel buttons.

**Parameters:**
- `text` - The question text
- `options` (optional):
  - All `InfoOptions` properties, plus:
  - `ok_label: str` - Custom OK button label
  - `cancel_label: str` - Custom Cancel button label
  - `default_cancel: bool` - Make Cancel the default button

**Returns:** `True` if OK clicked, `False` if cancelled

**Example:**
```python
from zenity_wrapper import QuestionOptions

confirm = zenity.question("Delete this file?", QuestionOptions(
    title="Confirm Deletion",
    ok_label="Delete",
    cancel_label="Keep"
))

if confirm:
    # Delete the file
    pass
```

---

### Input Dialogs

#### `entry(text: str, options: Optional[EntryOptions] = None) -> Optional[str]`

Displays a text entry dialog.

**Parameters:**
- `text` - The prompt text
- `options` (optional):
  - All common options, plus:
  - `entry_text: str` - Default/placeholder text
  - `hide_text: bool` - Hide input (for passwords)

**Returns:** The entered text, or `None` if cancelled

**Example:**
```python
from zenity_wrapper import EntryOptions

name = zenity.entry("Enter your name:", EntryOptions(entry_text="John Doe"))

if name:
    print(f"Hello, {name}!")
```

---

#### `password(options: Optional[PasswordOptions] = None) -> Optional[str]`

Displays a password entry dialog.

**Parameters:**
- `options` (optional):
  - All common options, plus:
  - `username: bool` - Also prompt for username

**Returns:** The password, or `username|password` if username option is enabled

**Example:**
```python
from zenity_wrapper import PasswordOptions

# Simple password
pwd = zenity.password()

# With username
credentials = zenity.password(PasswordOptions(username=True))
# Returns: "user|password"
```

---

#### `scale(text: str, options: Optional[ScaleOptions] = None) -> Optional[int]`

Displays a slider/scale dialog.

**Parameters:**
- `text` - The prompt text
- `options` (optional):
  - All common options, plus:
  - `value: int` - Initial value
  - `min_value: int` - Minimum value
  - `max_value: int` - Maximum value
  - `step: int` - Step increment
  - `print_partial: bool` - Print value changes to stdout
  - `hide_value: bool` - Hide the numeric value

**Returns:** The selected number, or `None` if cancelled

**Example:**
```python
from zenity_wrapper import ScaleOptions

volume = zenity.scale("Adjust volume:", ScaleOptions(
    value=50,
    min_value=0,
    max_value=100,
    step=5
))

print(f"Volume set to: {volume}")
```

---

#### `calendar(text: str, options: Optional[CalendarOptions] = None) -> Optional[str]`

Displays a calendar date picker.

**Parameters:**
- `text` - The prompt text
- `options` (optional):
  - All common options, plus:
  - `day: int` - Initial day (1-31)
  - `month: int` - Initial month (1-12)
  - `year: int` - Initial year
  - `date_format: str` - Output format (default: "%Y-%m-%d")

**Returns:** The selected date as a formatted string, or `None` if cancelled

**Example:**
```python
from zenity_wrapper import CalendarOptions

date = zenity.calendar("Select your birthday:", CalendarOptions(
    day=1,
    month=1,
    year=2000,
    date_format="%Y-%m-%d"
))

print(f"Birthday: {date}")
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

#### `list(text: str, columns: List[str], data: List[List[Union[str, int, bool]]], options: Optional[ListOptions] = None) -> Optional[Union[str, List[str]]]`

Displays a list selection dialog with various modes.

**Parameters:**
- `text` - The prompt text
- `columns` - List of column headers
- `data` - 2D list of row data
- `options` (optional):
  - All common options, plus:
  - `checklist: bool` - Enable checklist mode
  - `radiolist: bool` - Enable radio list mode
  - `multiple: bool` - Allow multiple selections
  - `editable: bool` - Allow editing cells
  - `separator: str` - Separator for multiple selections
  - `print_column: int` - Specific column to print
  - `hide_column: int` - Column to hide
  - `hide_header: bool` - Hide column headers

**Returns:** 
- Single selection: `str` (selected value)
- Multiple selections: `List[str]` (list of values)
- Cancelled: `None`

**Examples:**

**Simple List:**
```python
fruit = zenity.list(
    "Choose a fruit:",
    ["Fruit"],
    [["Apple"], ["Banana"], ["Orange"]]
)
```

**Checklist:**
```python
from zenity_wrapper import ListOptions

selected = zenity.list(
    "Select toppings:",
    ["Select", "Topping", "Price"],
    [
        [True, "Pepperoni", "$2.00"],
        [False, "Mushrooms", "$1.50"],
        [False, "Olives", "$1.00"]
    ],
    ListOptions(checklist=True, multiple=True)
)
# Returns: ["Pepperoni"] (if user keeps default selection)
```

**Radio List:**
```python
size = zenity.list(
    "Select size:",
    ["Select", "Size", "Price"],
    [
        [False, "Small", "$5.99"],
        [True, "Medium", "$7.99"],
        [False, "Large", "$9.99"]
    ],
    ListOptions(radiolist=True)
)
```

---

#### `color_selection(options: Optional[ColorSelectionOptions] = None) -> Optional[str]`

Displays a color picker dialog.

> **⚠️ macOS Compatibility:** The color selection dialog does not work on macOS due to limitations in the Zenity GTK implementation. Consider using alternative color picker solutions on macOS.

**Parameters:**
- `options` (optional):
  - All common options, plus:
  - `color: str` - Initial color (hex format like "#FF5733")
  - `show_palette: bool` - Show color palette

**Returns:** Selected color in rgb format (e.g., "rgb(255,87,51)"), or `None` if cancelled

**Note:** The wrapper automatically converts hex colors to the RGB format required by Zenity (16-bit values 0-65535).

**Example:**
```python
from zenity_wrapper import ColorSelectionOptions

color = zenity.color_selection(ColorSelectionOptions(
    color="#FF5733",
    show_palette=True
))

print(f"Selected color: {color}")
```

---

### File Dialogs

#### `file_selection(options: Optional[FileSelectionOptions] = None) -> Optional[Union[str, List[str]]]`

Displays a file or directory selection dialog.

**Parameters:**
- `options` (optional):
  - All common options, plus:
  - `multiple: bool` - Allow multiple file selection
  - `directory: bool` - Select directories instead of files
  - `save: bool` - Save mode instead of open
  - `separator: str` - Separator for multiple files
  - `filename: str` - Default filename (for save mode)
  - `confirm_overwrite: bool` - Confirm before overwriting in save mode

**Returns:**
- Single file: `str` (file path)
- Multiple files: `List[str]` (list of file paths)
- Cancelled: `None`

**Examples:**

**Open File:**
```python
file = zenity.file_selection()
```

**Open Multiple Files:**
```python
from zenity_wrapper import FileSelectionOptions

files = zenity.file_selection(FileSelectionOptions(
    multiple=True,
    separator="|"
))
```

**Select Directory:**
```python
dir = zenity.file_selection(FileSelectionOptions(directory=True))
```

**Save File:**
```python
save_path = zenity.file_selection(FileSelectionOptions(
    save=True,
    confirm_overwrite=True,
    filename="document.txt"
))
```

---

### Progress Dialogs

#### `progress(text: str, options: Optional[ProgressOptions] = None) -> subprocess.Popen`

Displays a progress dialog.

**Parameters:**
- `text` - The progress message
- `options` (optional):
  - All common options, plus:
  - `percentage: int` - Initial percentage (0-100)
  - `pulsate: bool` - Use pulsating progress bar
  - `auto_close: bool` - Auto-close when complete
  - `auto_kill: bool` - Kill parent process if dialog is closed
  - `no_cancel: bool` - Disable cancel button
  - `time_remaining: bool` - Show estimated time remaining

**Returns:** A `subprocess.Popen` object with `stdin` for updates

**Usage:**
- Write percentage to stdin: `process.stdin.write("50\n")`
- Update message: `process.stdin.write("# Loading...\n")`
- Complete: `process.stdin.close()`

**Examples:**

**Percentage Progress:**
```python
from zenity_wrapper import ProgressOptions
import time

progress = zenity.progress("Loading...", ProgressOptions(
    percentage=0,
    auto_close=True
))

for i in range(0, 101, 10):
    progress.stdin.write(f"{i}\n")
    progress.stdin.write(f"# Loading {i}%\n")
    progress.stdin.flush()
    time.sleep(0.5)

progress.stdin.close()
progress.wait()
```

**Pulsating Progress:**
```python
import time

progress = zenity.progress("Processing...", ProgressOptions(
    pulsate=True,
    auto_close=True,
    no_cancel=True
))

# Do work...
time.sleep(3)
progress.stdin.write("100\n")
progress.stdin.close()
progress.wait()
```

#### `update_progress(process: subprocess.Popen, percentage: int, text: str = '') -> None`

Helper method to update a progress dialog.

**Parameters:**
- `process` - The process object returned by `progress()`
- `percentage` - Progress percentage (0-100)
- `text` - Optional text to update the progress message

**Example:**
```python
progress = zenity.progress("Loading...", ProgressOptions(
    percentage=0,
    auto_close=True
))

# Using the helper method
zenity.update_progress(progress, 25, "Processing files...")
zenity.update_progress(progress, 50, "Half way there...")
zenity.update_progress(progress, 100, "Complete!")

progress.stdin.close()
progress.wait()
```

---

#### `progress_context(text: str, options: Optional[ProgressOptions] = None) -> ProgressContext`

Returns a context manager for progress dialogs with automatic cleanup.

**Parameters:**
- `text` - The progress message
- `options` - Same as `progress()`

**Returns:** A `ProgressContext` object with `update(percentage, text)` method

**Example:**
```python
from zenity_wrapper import ProgressOptions
import time

# Using context manager for automatic cleanup
with zenity.progress_context("Processing...", ProgressOptions(percentage=0)) as progress:
    progress.update(25, "Loading files...")
    time.sleep(1)
    progress.update(50, "Processing data...")
    time.sleep(1)
    progress.update(75, "Saving results...")
    time.sleep(1)
    progress.update(100, "Complete!")
# Automatically closes when exiting context
```

---

### Advanced Dialogs

#### `forms(fields: List[Dict[str, Any]], options: Optional[FormsOptions] = None) -> Optional[List[str]]`

Displays a multi-field form dialog.

**Parameters:**
- `fields` - List of form field dictionaries:
  - `{'type': 'entry', 'label': str}` - Single-line text entry field
  - `{'type': 'password', 'label': str}` - Password field
  - `{'type': 'multiline', 'label': str}` - Multi-line text area
  - `{'type': 'calendar', 'label': str}` - Date picker field
  - `{'type': 'list', 'label': str, 'header': str, 'values': List[str]}` - List selection field
  - `{'type': 'combo', 'label': str, 'values': List[str]}` - Combo box (dropdown) field
- `options` (optional):
  - All common options, plus:
  - `text: str` - Form description text
  - `separator: str` - Field separator in output (default: "|")
  - `forms_date_format: str` - Date format for calendar fields
  - `show_header: bool` - Show column headers for list fields

**Returns:** List of values (one per field), or `None` if cancelled

**Examples:**

**Basic Form:**
```python
from zenity_wrapper import FormsOptions

data = zenity.forms(
    [
        {'type': 'entry', 'label': 'Name'},
        {'type': 'entry', 'label': 'Email'},
        {'type': 'password', 'label': 'Password'}
    ],
    FormsOptions(
        text="Please enter your information:",
        separator="|"
    )
)

if data:
    name, email, password = data
    print(f"Name: {name}, Email: {email}")
```

**Advanced Form with All Field Types:**
```python
data = zenity.forms(
    [
        {'type': 'entry', 'label': 'Username'},
        {'type': 'password', 'label': 'Password'},
        {'type': 'multiline', 'label': 'Bio'},
        {'type': 'calendar', 'label': 'Birth Date'},
        {
            'type': 'combo',
            'label': 'Gender',
            'values': ['Male', 'Female', 'Other', 'Prefer not to say']
        },
        {
            'type': 'list',
            'label': 'Country',
            'header': 'Select Country',
            'values': ['USA', 'Canada', 'UK', 'Australia', 'Germany', 'France']
        }
    ],
    FormsOptions(
        text="Registration Form:",
        separator="|",
        forms_date_format="%Y-%m-%d",
        show_header=True
    )
)

if data:
    username, password, bio, birth_date, gender, country = data
    print(f"User: {username}, Country: {country}")
```

---

#### `text(text: str, options: Optional[TextOptions] = None) -> Optional[str]`

Displays a text information dialog with optional editing.

**Parameters:**
- `text` - The text to display
- `options` (optional):
  - All common options, plus:
  - `filename: str` - Load text from file
  - `editable: bool` - Allow editing the text
  - `font_name: str` - Font to use
  - `checkbox: str` - Add checkbox with label
  - `html: bool` - Enable HTML rendering
  - `url: str` - Load from URL
  - `auto_scroll: bool` - Auto-scroll to bottom

**Returns:** The (possibly edited) text, or `None` if cancelled

**Examples:**

**Display Text:**
```python
result = zenity.text("This is some information.\n\nRead-only text display.")
```

**Editable Text:**
```python
from zenity_wrapper import TextOptions

edited_text = zenity.text(
    "Edit this content...",
    TextOptions(editable=True)
)

if edited_text:
    print(f"User entered: {edited_text}")
```

**Load from File:**
```python
content = zenity.text("", TextOptions(
    filename="/path/to/file.txt",
    editable=True
))
```

---

## Common Options

All dialog methods support these common options through their respective Options classes:

```python
@dataclass
class CommonOptions:
    title: Optional[str] = None           # Window title
    width: Optional[int] = None           # Dialog width in pixels
    height: Optional[int] = None          # Dialog height in pixels
    timeout: Optional[int] = None         # Auto-close timeout in seconds
    ok_label: Optional[str] = None        # Custom OK button label
    cancel_label: Optional[str] = None    # Custom Cancel button label
    extra_button: Optional[str] = None    # Extra button label
    modal_hint: bool = False              # Make dialog modal
    attach_parent: Optional[int] = None   # Attach to parent window (XID)
```

---

## Error Handling

All methods handle Zenity errors gracefully:

```python
try:
    result = zenity.info("Hello!")
except Exception as error:
    print(f"Dialog error: {error}")
```

When a user cancels a dialog, the method returns `None` (not an error).

---

## Type Hints

The wrapper is fully typed for better IDE support:

```python
from typing import Optional, List, Union, Dict, Any
from zenity_wrapper import (
    Zenity,
    # Common options
    CommonOptions,
    # Message dialog options
    InfoOptions,
    QuestionOptions,
    # Input dialog options
    EntryOptions,
    PasswordOptions,
    ScaleOptions,
    CalendarOptions,
    # Selection dialog options
    ListOptions,
    ColorSelectionOptions,
    # File dialog options
    FileSelectionOptions,
    # Progress dialog options
    ProgressOptions,
    # Advanced dialog options
    FormsOptions,
    TextOptions
)
```

---

## Running the Demo

To see all dialogs in action:

```bash
cd python_zenity_wrapper
python3 demo.py
```

---

## License

MIT

---

## Contributing

Contributions are welcome! Please ensure all dialogs are tested with Zenity installed.
