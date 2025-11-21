#!/usr/bin/env python3
"""
Complete demo of all Zenity wrapper functionality
"""

import time
import sys
import os

# Add parent directory to path to import the package
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Now we can import normally - VS Code will provide full IntelliSense!
from python_zenity_wrapper import (
    Zenity,
    InfoOptions,
    QuestionOptions,
    EntryOptions,
    PasswordOptions,
    ListOptions,
    FileSelectionOptions,
    ColorSelectionOptions,
    CalendarOptions,
    ScaleOptions,
    FormsOptions,
    TextOptions,
    ProgressOptions
)


def demo_all_features():
    """Run all Zenity demos"""
    zenity = Zenity()
    
    try:
        print("=== Zenity Wrapper Complete Demo ===\n")

        # 1. Info Dialog
        print("1. Info Dialog")
        zenity.info("This is an info dialog", InfoOptions(title="Information"))

        # 2. Warning Dialog
        print("2. Warning Dialog")
        zenity.warning("This is a warning!", InfoOptions(title="Warning"))

        # 3. Error Dialog
        print("3. Error Dialog")
        zenity.error("This is an error message", InfoOptions(title="Error"))

        # 4. Question Dialog
        print("4. Question Dialog")
        answer = zenity.question(
            "Do you want to continue the demo?",
            QuestionOptions(
                title="Question",
                ok_label="Yes, continue",
                cancel_label="No, stop"
            )
        )
        print(f"User answered: {'Yes' if answer else 'No'}")
        if not answer:
            print("Demo cancelled by user")
            return

        # 5. Entry Dialog
        print("\n5. Entry Dialog")
        name = zenity.entry("Enter your name:", EntryOptions(entry_text="John Doe"))
        print(f"Name entered: {name}")

        # 6. Password Dialog
        print("\n6. Password Dialog")
        password = zenity.password(PasswordOptions(username=True))
        print(f"Password/Username entered: {'***hidden***' if password else 'cancelled'}")

        # 7. Entry Dialog with Hidden Text
        print("\n7. Entry Dialog (Hidden Text)")
        secret = zenity.entry("Enter a secret:", EntryOptions(hide_text=True))
        print(f"Secret entered: {'***hidden***' if secret else 'cancelled'}")

        # 8. List Dialog - Simple
        print("\n8. List Dialog (Simple)")
        selected_item = zenity.list(
            "Select an item:",
            ["Item"],
            [["Apple"], ["Banana"], ["Orange"], ["Grape"]]
        )
        print(f"Selected item: {selected_item}")

        # 9. List Dialog - Checklist
        print("\n9. List Dialog (Checklist)")
        selected_fruits = zenity.list(
            "Select your favorite fruits:",
            ["Select", "Fruit", "Color"],
            [
                [False, "Apple", "Red"],
                [False, "Banana", "Yellow"],
                [False, "Orange", "Orange"],
                [False, "Grape", "Purple"]
            ],
            ListOptions(checklist=True, multiple=True)
        )
        print(f"Selected fruits: {selected_fruits}")

        # 10. List Dialog - Radio List
        print("\n10. List Dialog (Radio List)")
        selected_os = zenity.list(
            "Select your operating system:",
            ["Select", "OS", "Year"],
            [
                [False, "Linux", "1991"],
                [True, "macOS", "2001"],
                [False, "Windows", "1985"]
            ],
            ListOptions(radiolist=True)
        )
        print(f"Selected OS: {selected_os}")

        # 11. File Selection Dialog
        print("\n11. File Selection Dialog")
        file = zenity.file_selection(FileSelectionOptions(multiple=False))
        print(f"Selected file: {file}")

        # 12. File Selection Dialog - Multiple
        print("\n12. File Selection Dialog (Multiple)")
        files = zenity.file_selection(
            FileSelectionOptions(multiple=True, separator="|")
        )
        print(f"Selected files: {files}")

        # 13. Directory Selection
        print("\n13. Directory Selection")
        directory = zenity.file_selection(FileSelectionOptions(directory=True))
        print(f"Selected directory: {directory}")

        # 14. File Save Dialog
        print("\n14. File Save Dialog")
        save_file = zenity.file_selection(
            FileSelectionOptions(
                save=True,
                confirm_overwrite=True,
                filename="untitled.txt"
            )
        )
        print(f"Save location: {save_file}")

        # 15. Color Selection
        print("\n15. Color Selection")
        color = zenity.color_selection(
            ColorSelectionOptions(color="#FF5733", show_palette=True)
        )
        print(f"Selected color: {color}")

        # 16. Calendar Dialog
        print("\n16. Calendar Dialog")
        date = zenity.calendar(
            "Select a date:",
            CalendarOptions(day=21, month=11, year=2025, date_format="%Y-%m-%d")
        )
        print(f"Selected date: {date}")

        # 17. Scale Dialog
        print("\n17. Scale Dialog")
        scale_value = zenity.scale(
            "Select a value:",
            ScaleOptions(value=50, min_value=0, max_value=100, step=5)
        )
        print(f"Selected value: {scale_value}")

        # 18. Scale Dialog with Hidden Value
        print("\n18. Scale Dialog (Hidden Value)")
        hidden_scale = zenity.scale(
            "Adjust the slider:",
            ScaleOptions(value=25, min_value=0, max_value=100, step=1, hide_value=True)
        )
        print(f"Selected value: {hidden_scale}")

        # 19. Forms Dialog - Basic
        print("\n19. Forms Dialog (Basic)")
        form_data = zenity.forms(
            [
                {'type': 'entry', 'label': 'Name'},
                {'type': 'entry', 'label': 'Email'},
                {'type': 'password', 'label': 'Password'}
            ],
            FormsOptions(text="Please enter your information:", separator="|")
        )
        print(f"Form data: {form_data}")

        # 20. Forms Dialog - Advanced with All Field Types
        print("\n20. Forms Dialog (Advanced with All Field Types)")
        advanced_form = zenity.forms(
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
        print(f"Advanced form data: {advanced_form}")

        # 21. Forms Dialog - Multiline Entry Focus
        print("\n21. Forms Dialog (Multiline Entry)")
        multiline_form = zenity.forms(
            [
                {'type': 'entry', 'label': 'Title'},
                {'type': 'multiline', 'label': 'Description'},
                {'type': 'entry', 'label': 'Tags'}
            ],
            FormsOptions(
                text="Create a Post",
                separator="||",
                title="Post Creator"
            )
        )
        print(f"Multiline form data: {multiline_form}")

        # 22. Text Dialog
        print("\n22. Text Dialog")
        edited_text = zenity.text(
            "This is a text information dialog.\n\nYou can edit and write in this text area.",
            TextOptions(editable=True)
        )
        print(f"Edited text: {edited_text}")

        # 23. Progress Dialog - Pulsate
        print("\n23. Progress Dialog (Pulsate)")
        pulsate_process = zenity.progress(
            "Processing...",
            ProgressOptions(pulsate=True, auto_close=True, no_cancel=True)
        )
        time.sleep(2)
        if pulsate_process.stdin:
            pulsate_process.stdin.write('100\n')
            pulsate_process.stdin.close()
        pulsate_process.wait()
        print("Pulsate progress completed")

        # 24. Progress Dialog - Percentage
        print("\n24. Progress Dialog (Percentage)")
        percent_process = zenity.progress(
            "Loading...",
            ProgressOptions(percentage=0, auto_close=True)
        )
        if percent_process.stdin:
            for i in range(0, 101, 10):
                percent_process.stdin.write(f'{i}\n')
                percent_process.stdin.write(f'# Loading {i}%\n')
                percent_process.stdin.flush()
                time.sleep(0.2)
            percent_process.stdin.close()
        percent_process.wait()
        print("Percentage progress completed")

        print("\n=== All Demos Completed! ===")

    except Exception as error:
        print(f"Error: {error}")


if __name__ == "__main__":
    demo_all_features()
