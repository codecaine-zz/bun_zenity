# Python Zenity Wrapper

A comprehensive Python wrapper for Zenity dialogs that makes it easy to create native desktop dialogs in your Python applications.

## 🚀 Features

- **Complete Zenity API Coverage** - All dialog types supported
- **Type-Safe** - Full type hints with dataclasses
- **Cross-Platform** - Works on Linux and macOS (with automatic GTK4 fixes)
- **Clean API** - Pythonic interface with sensible defaults
- **Well Documented** - Comprehensive API documentation and examples
- **Zero Dependencies** - Uses only Python standard library

## 📋 Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Supported Dialogs](#supported-dialogs)
- [Usage Examples](#usage-examples)
- [Documentation](#documentation)
- [Demo](#demo)
- [Requirements](#requirements)
- [License](#license)

## 📦 Installation

### Prerequisites

Zenity must be installed on your system:

```bash
# macOS
brew install zenity

# Ubuntu/Debian
sudo apt-get install zenity

# Fedora
sudo dnf install zenity
```

### Install the Wrapper

Simply copy the wrapper file to your project:

```bash
cp zenity-wrapper.py /path/to/your/project/
```

Or clone the full multi-language project (includes the Bun/TypeScript implementation):

```bash
git clone https://github.com/codecaine-zz/bun_zenity.git
cd bun_zenity/python_zenity_wrapper
```

## 🎯 Quick Start

```python
# Import the wrapper
from python_zenity_wrapper import Zenity, InfoOptions, QuestionOptions

# Create a Zenity instance
zenity = Zenity()

# Show an info dialog
zenity.info("Hello, World!", InfoOptions(title="Greeting"))

# Ask a question
if zenity.question("Do you want to continue?"):
    print("User clicked OK!")
else:
    print("User clicked Cancel")

# Get user input
name = zenity.entry("What's your name?")
if name:
    print(f"Hello, {name}!")
```
```

## 🎨 Supported Dialogs

### Message Dialogs
- **Info** - Display information messages
- **Warning** - Show warning messages
- **Error** - Display error messages
- **Question** - Ask yes/no questions

### Input Dialogs
- **Entry** - Single-line text input
- **Password** - Password input (with optional username)
- **Scale** - Slider for numeric input
- **Calendar** - Date picker

### Selection Dialogs
- **List** - Choose from a list (with checklist/radiolist modes)
- **Color Selection** - Pick a color
- **File Selection** - Choose files or directories

### Advanced Dialogs
- **Forms** - Multi-field forms with various input types
- **Text** - Display and edit large text
- **Progress** - Show progress with updates

## 💡 Usage Examples

### Simple Info Dialog

```python
from zenity_wrapper import Zenity, InfoOptions

zenity = Zenity()
zenity.info("Operation completed!", InfoOptions(
    title="Success",
    timeout=5  # Auto-close after 5 seconds
))
```

### Question Dialog

```python
from zenity_wrapper import QuestionOptions

confirm = zenity.question(
    "Delete this file?",
    QuestionOptions(
        title="Confirm Deletion",
        ok_label="Delete",
        cancel_label="Keep"
    )
)

if confirm:
    # Delete the file
    print("File deleted!")
```

### Text Entry

```python
from zenity_wrapper import EntryOptions

name = zenity.entry(
    "Enter your name:",
    EntryOptions(entry_text="John Doe")
)

if name:
    print(f"Hello, {name}!")
```

### Password Input

```python
from zenity_wrapper import PasswordOptions

# Simple password
password = zenity.password()

# With username
credentials = zenity.password(PasswordOptions(username=True))
if credentials:
    username, password = credentials.split('|')
    print(f"User: {username}")
```

### List Selection

```python
from zenity_wrapper import ListOptions

# Simple list
fruit = zenity.list(
    "Choose a fruit:",
    ["Fruit"],
    [["Apple"], ["Banana"], ["Orange"]]
)

# Checklist
toppings = zenity.list(
    "Select pizza toppings:",
    ["Select", "Topping", "Price"],
    [
        [False, "Pepperoni", "$2.00"],
        [False, "Mushrooms", "$1.50"],
        [False, "Olives", "$1.00"]
    ],
    ListOptions(checklist=True, multiple=True)
)

print(f"Selected: {toppings}")
```

### File Selection

```python
from zenity_wrapper import FileSelectionOptions

# Open single file
file = zenity.file_selection()

# Open multiple files
files = zenity.file_selection(
    FileSelectionOptions(multiple=True, separator="|")
)

# Select directory
directory = zenity.file_selection(
    FileSelectionOptions(directory=True)
)

# Save file
save_path = zenity.file_selection(
    FileSelectionOptions(
        save=True,
        filename="document.txt",
        confirm_overwrite=True
    )
)
```

### Calendar

```python
from zenity_wrapper import CalendarOptions

date = zenity.calendar(
    "Select a date:",
    CalendarOptions(
        day=21,
        month=11,
        year=2025,
        date_format="%Y-%m-%d"
    )
)

print(f"Selected date: {date}")
```

### Scale (Slider)

```python
from zenity_wrapper import ScaleOptions

volume = zenity.scale(
    "Adjust volume:",
    ScaleOptions(
        value=50,
        min_value=0,
        max_value=100,
        step=5
    )
)

print(f"Volume: {volume}%")
```

### Forms Dialog

```python
from zenity_wrapper import FormsOptions

data = zenity.forms(
    [
        {'type': 'entry', 'label': 'Name'},
        {'type': 'entry', 'label': 'Email'},
        {'type': 'password', 'label': 'Password'},
        {'type': 'calendar', 'label': 'Birth Date'},
        {
            'type': 'combo',
            'label': 'Country',
            'values': ['USA', 'Canada', 'UK', 'Germany']
        }
    ],
    FormsOptions(
        text="Registration Form",
        separator="|",
        forms_date_format="%Y-%m-%d"
    )
)

if data:
    name, email, password, birth_date, country = data
    print(f"Name: {name}")
    print(f"Email: {email}")
    print(f"Country: {country}")
```

### Progress Dialog

```python
from zenity_wrapper import ProgressOptions
import time

# Percentage-based progress
progress = zenity.progress(
    "Loading...",
    ProgressOptions(percentage=0, auto_close=True)
)

for i in range(0, 101, 10):
    progress.stdin.write(f"{i}\n")
    progress.stdin.write(f"# Processing {i}%...\n")
    progress.stdin.flush()
    time.sleep(0.3)

progress.stdin.close()
progress.wait()

# Or use the helper method
progress = zenity.progress("Working...", ProgressOptions(percentage=0))
zenity.update_progress(progress, 50, "Half done!")
zenity.update_progress(progress, 100, "Complete!")
progress.stdin.close()
progress.wait()
```

### Text Dialog

```python
from zenity_wrapper import TextOptions

# Display text
zenity.text("This is some information to display.")

# Editable text
edited = zenity.text(
    "Edit this content...",
    TextOptions(editable=True)
)

if edited:
    print(f"User edited: {edited}")

# Load from file
content = zenity.text(
    "",
    TextOptions(filename="/path/to/file.txt", editable=True)
)
```

## 📚 Documentation

Full API documentation is available in [ZENITY_API.md](ZENITY_API.md).

## 🎬 Demo

Run the comprehensive demo to see all dialogs in action:

```bash
cd python_zenity_wrapper
python3 demo.py
```

The demo includes 24 different dialog examples showcasing all features.

## ⚙️ Requirements

- **Python**: 3.7 or higher
- **Zenity**: Must be installed on your system
- **OS**: Linux or macOS

### macOS Notes

The wrapper automatically handles macOS GTK4 compatibility issues by setting:
- `GSETTINGS_BACKEND=memory`
- `GSETTINGS_SCHEMA_DIR=/dev/null`

No additional configuration needed!

### Known Limitations

- **Color Selection on macOS**: The color picker dialog doesn't work properly on macOS due to Zenity GTK limitations. Consider alternative solutions for color picking on macOS.

## 🏗️ Architecture

The wrapper uses:
- **dataclasses** for type-safe options
- **subprocess** module for running Zenity commands
- **Type hints** throughout for better IDE support
- **Environment variables** to fix macOS GTK4 issues

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with `python3 demo.py`
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🔗 Related

- **Bun / TypeScript Version**: The original implementation lives at the root of the same repository you just cloned (`bun_zenity`). Navigate back to the repo root for the TypeScript sources:

    ```bash
    cd ../..
    ls
    ```

    You can install and run the Bun version with:

    ```bash
    bun install
    bun run demo
    ```

- [Zenity Documentation](https://help.gnome.org/users/zenity/) - Official Zenity docs
- [GTK Documentation](https://docs.gtk.org/) - GTK library documentation

## ✨ Credits

Created as a Python port of the TypeScript Zenity wrapper.

---

Enjoy building beautiful desktop dialogs with Python! 🐍✨
