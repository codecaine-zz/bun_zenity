"""
Python wrapper for Zenity dialogs
Provides a clean API for creating native desktop dialogs using Zenity
"""

import subprocess
import os
import shutil
from typing import Optional, List, Union, Dict, Any, Iterable
from dataclasses import dataclass, field


@dataclass
class CommonOptions:
    """Common options for all dialogs.
    
    Attributes:
        title: Dialog window title
        width: Dialog width in pixels
        height: Dialog height in pixels
        timeout: Auto-close after N seconds
        ok_label: Custom OK button label
        cancel_label: Custom Cancel button label
        extra_button: Extra button label
        modal_hint: Make dialog modal
        attach_parent: Attach to parent window (XID)
    """
    title: Optional[str] = None
    width: Optional[int] = None
    height: Optional[int] = None
    timeout: Optional[int] = None
    ok_label: Optional[str] = None
    cancel_label: Optional[str] = None
    extra_button: Optional[str] = None
    modal_hint: bool = False
    attach_parent: Optional[int] = None


@dataclass
class InfoOptions(CommonOptions):
    """Options for info/warning/error dialogs.
    
    Inherits all CommonOptions attributes.
    
    Attributes:
        no_wrap: Disable text wrapping
        no_markup: Disable Pango markup
        ellipsize: Enable text ellipsization
        icon_name: Custom icon name
    """
    no_wrap: bool = False
    no_markup: bool = False
    ellipsize: bool = False
    icon_name: Optional[str] = None


@dataclass
class QuestionOptions(CommonOptions):
    """Options for question dialogs.
    
    Inherits all CommonOptions attributes.
    
    Attributes:
        default_cancel: Make Cancel the default button
        no_wrap: Disable text wrapping
        no_markup: Disable Pango markup
        ellipsize: Enable text ellipsization
    """
    default_cancel: bool = False
    no_wrap: bool = False
    no_markup: bool = False
    ellipsize: bool = False


@dataclass
class EntryOptions(CommonOptions):
    """Options for entry dialogs.
    
    Inherits all CommonOptions attributes.
    
    Attributes:
        entry_text: Default/placeholder text
        hide_text: Hide input text (for passwords)
    """
    entry_text: Optional[str] = None
    hide_text: bool = False


@dataclass
class PasswordOptions(CommonOptions):
    """Options for password dialogs.
    
    Inherits all CommonOptions attributes.
    
    Attributes:
        username: Also prompt for username (returns 'username|password')
    """
    username: bool = False


@dataclass
class ScaleOptions(CommonOptions):
    """Options for scale (slider) dialogs.
    
    Inherits all CommonOptions attributes.
    
    Attributes:
        value: Initial value
        min_value: Minimum value
        max_value: Maximum value
        step: Step increment
        print_partial: Print value changes to stdout
        hide_value: Hide the numeric value display
    """
    value: Optional[int] = None
    min_value: Optional[int] = None
    max_value: Optional[int] = None
    step: Optional[int] = None
    print_partial: bool = False
    hide_value: bool = False


@dataclass
class CalendarOptions(CommonOptions):
    """Options for calendar dialogs.
    
    Inherits all CommonOptions attributes.
    
    Attributes:
        day: Initial day (1-31)
        month: Initial month (1-12)
        year: Initial year
        date_format: Output date format (default: '%Y-%m-%d')
    """
    day: Optional[int] = None
    month: Optional[int] = None
    year: Optional[int] = None
    date_format: Optional[str] = None


@dataclass
class ListOptions(CommonOptions):
    """Options for list selection dialogs.
    
    Inherits all CommonOptions attributes.
    
    Attributes:
        checklist: Enable checklist mode (checkboxes)
        radiolist: Enable radio list mode (radio buttons)
        imagelist: Enable image list mode
        multiple: Allow multiple selections
        editable: Allow editing cells
        separator: Separator for multiple selections (e.g., '|')
        print_column: Specific column index to print
        hide_column: Column index to hide
        hide_header: Hide column headers
    """
    checklist: bool = False
    radiolist: bool = False
    imagelist: bool = False
    multiple: bool = False
    editable: bool = False
    separator: Optional[str] = None
    print_column: Optional[int] = None
    hide_column: Optional[int] = None
    hide_header: bool = False


@dataclass
class ColorSelectionOptions(CommonOptions):
    """Options for color selection dialogs.
    
    Inherits all CommonOptions attributes.
    
    Attributes:
        color: Initial color (hex format like '#FF5733')
        show_palette: Show color palette
    
    Note:
        Color selection may not work properly on macOS due to GTK limitations.
    """
    color: Optional[str] = None
    show_palette: bool = False


@dataclass
class FileSelectionOptions(CommonOptions):
    """Options for file selection dialogs.
    
    Inherits all CommonOptions attributes.
    
    Attributes:
        multiple: Allow multiple file selection
        directory: Select directories instead of files
        save: Save mode instead of open mode
        separator: Separator for multiple file paths (e.g., '|')
        filename: Default filename (useful in save mode)
        confirm_overwrite: Confirm before overwriting existing file in save mode
    """
    multiple: bool = False
    directory: bool = False
    save: bool = False
    separator: Optional[str] = None
    filename: Optional[str] = None
    confirm_overwrite: bool = False


@dataclass
class ProgressOptions(CommonOptions):
    """Options for progress dialogs.
    
    Inherits all CommonOptions attributes.
    
    Attributes:
        percentage: Initial percentage (0-100)
        pulsate: Use pulsating progress bar instead of percentage
        auto_close: Auto-close when reaching 100%
        auto_kill: Kill parent process if dialog is closed
        no_cancel: Disable cancel button
        time_remaining: Show estimated time remaining
    """
    percentage: Optional[int] = None
    pulsate: bool = False
    auto_close: bool = False
    auto_kill: bool = False
    no_cancel: bool = False
    time_remaining: bool = False


@dataclass
class FormsOptions(CommonOptions):
    """Options for forms dialogs.
    
    Inherits all CommonOptions attributes.
    
    Attributes:
        text: Form description text displayed at the top
        separator: Field value separator in output (default: '|')
        forms_date_format: Date format for calendar fields (e.g., '%Y-%m-%d')
        show_header: Show column headers for list fields
    """
    text: Optional[str] = None
    separator: Optional[str] = None
    forms_date_format: Optional[str] = None
    show_header: bool = False


@dataclass
class TextOptions(CommonOptions):
    """Options for text display/edit dialogs.
    
    Inherits all CommonOptions attributes.
    
    Attributes:
        filename: Load text from this file path
        editable: Allow editing the text
        font_name: Font to use for displaying text
        checkbox: Add a checkbox with this label
        html: Enable HTML rendering mode
        html_mode: Alias for html (enable HTML rendering)
        url: Load content from this URL
        auto_scroll: Automatically scroll to bottom
    """
    filename: Optional[str] = None
    editable: bool = False
    font_name: Optional[str] = None
    checkbox: Optional[str] = None
    html: bool = False
    html_mode: bool = False
    url: Optional[str] = None
    auto_scroll: bool = False


class Zenity:
    """Main Zenity wrapper class"""

    def __init__(self):
        """Initialize the Zenity wrapper

        Raises:
            FileNotFoundError: If the `zenity` binary cannot be located in PATH.
        """
        if shutil.which('zenity') is None:
            raise FileNotFoundError("Zenity binary not found in PATH. Please install zenity (e.g. 'brew install zenity').")

    def text(self, message: str, options: Optional[TextOptions] = None) -> Optional[str]:
        """Display a text information dialog.
        
        Args:
            message: The text to display
            options: TextOptions for customization (title, width, editable, etc.)
        
        Returns:
            The (possibly edited) text if OK clicked, None if cancelled
        
        Example:
            >>> zenity = Zenity()
            >>> text = zenity.text("Edit this", TextOptions(editable=True))
        """
        if options is None:
            options = TextOptions()
        
        args = ['--text-info']
        if message:
            args.append(f'--text={message}')
        if options.filename:
            args.append(f'--filename={options.filename}')
        if options.editable:
            args.append('--editable')
        if options.html or options.html_mode:
            args.append('--html')
        if options.url:
            args.append(f'--url={options.url}')
        if options.font_name:
            args.append(f'--font={options.font_name}')
        if options.checkbox:
            args.append(f'--checkbox={options.checkbox}')
        if options.auto_scroll:
            args.append('--auto-scroll')
        self._add_common_options(args, options)
        
        try:
            return self._run(args)
        except subprocess.CalledProcessError:
            # Exit code 1 means user cancelled
            return None

    def info(self, message: str, options: Optional[InfoOptions] = None) -> None:
        """Display an information dialog (wrapper for _message_dialog)."""
        self._message_dialog('--info', message, options or InfoOptions())

    def warning(self, message: str, options: Optional[InfoOptions] = None) -> None:
        """Display a warning dialog (wrapper for _message_dialog)."""
        self._message_dialog('--warning', message, options or InfoOptions())

    def error(self, message: str, options: Optional[InfoOptions] = None) -> None:
        """Display an error dialog (wrapper for _message_dialog)."""
        self._message_dialog('--error', message, options or InfoOptions())

    def question(self, message: str, options: Optional[QuestionOptions] = None) -> bool:
        """Display a question dialog with Yes/No or OK/Cancel buttons.
        
        Args:
            message: The question text to display
            options: QuestionOptions for customization (title, ok_label, cancel_label, etc.)
        
        Returns:
            True if OK/Yes clicked, False if Cancel/No clicked
        
        Example:
            >>> zenity = Zenity()
            >>> if zenity.question("Delete file?", QuestionOptions(ok_label="Delete")):
            ...     print("Deleting...")
        """
        if options is None:
            options = QuestionOptions()
        
        args = ['--question', f'--text={message}']
        self._add_common_options(args, options)
        if options.default_cancel:
            args.append('--default-cancel')
        if options.no_wrap:
            args.append('--no-wrap')
        if options.no_markup:
            args.append('--no-markup')
        if options.ellipsize:
            args.append('--ellipsize')
        
        try:
            self._run(args)
            return True  # User clicked Yes/OK
        except subprocess.CalledProcessError:
            # Exit code 1 means user clicked No/Cancel
            return False

    def entry(self, text: str, options: Optional[EntryOptions] = None) -> Optional[str]:
        """Display a text entry dialog for single-line input.
        
        Args:
            text: The prompt text to display
            options: EntryOptions for customization (entry_text, hide_text, etc.)
        
        Returns:
            The entered text if OK clicked, None if cancelled
        
        Example:
            >>> zenity = Zenity()
            >>> name = zenity.entry("Enter your name:", EntryOptions(entry_text="John"))
        """
        if options is None:
            options = EntryOptions()
        
        args = ['--entry']
        if text:
            args.append(f'--text={text}')
        if options.entry_text:
            args.append(f'--entry-text={options.entry_text}')
        if options.hide_text:
            args.append('--hide-text')
        self._add_common_options(args, options)
        
        try:
            return self._run(args)
        except subprocess.CalledProcessError:
            # Exit code 1 means user cancelled
            return None

    def password(self, options: Optional[PasswordOptions] = None) -> Optional[str]:
        """Display a password entry dialog.
        
        Args:
            options: PasswordOptions for customization (username, title, etc.)
        
        Returns:
            The password if OK clicked, or 'username|password' if username=True.
            Returns None if cancelled.
        
        Example:
            >>> zenity = Zenity()
            >>> pwd = zenity.password()
            >>> creds = zenity.password(PasswordOptions(username=True))
        """
        if options is None:
            options = PasswordOptions()
        
        args = ['--password']
        if options.username:
            args.append('--username')
        self._add_common_options(args, options)
        
        try:
            return self._run(args)
        except subprocess.CalledProcessError:
            # Exit code 1 means user cancelled
            return None

    def list(
        self,
        text: str,
        columns: List[str],
        items: List[List[Union[str, int, bool]]],
        options: Optional[ListOptions] = None
    ) -> Optional[Union[str, List[str]]]:
        """Display a list selection dialog.
        
        Args:
            text: The prompt text to display
            columns: List of column headers (e.g., ['Name', 'Age'])
            items: 2D list of row data (e.g., [['John', 30], ['Jane', 25]])
            options: ListOptions for mode and customization (checklist, radiolist, multiple, etc.)
        
        Returns:
            Single selection: str (selected value)
            Multiple selections: List[str] (list of values if multiple=True)
            Cancelled: None
        
        Example:
            >>> zenity = Zenity()
            >>> # Simple list
            >>> fruit = zenity.list("Choose:", ["Fruit"], [["Apple"], ["Banana"]])
            >>> # Checklist
            >>> items = zenity.list("Select:", ["Select", "Item"], 
            ...                     [[False, "A"], [True, "B"]], 
            ...                     ListOptions(checklist=True, multiple=True))
        """
        if options is None:
            options = ListOptions()
        
        args = ['--list']
        
        if text:
            args.append(f'--text={text}')
        if options.checklist:
            args.append('--checklist')
        if options.radiolist:
            args.append('--radiolist')
        if options.imagelist:
            args.append('--imagelist')
        if options.multiple:
            args.append('--multiple')
        if options.editable:
            args.append('--editable')
        if options.separator:
            args.append(f'--separator={options.separator}')
        if options.print_column is not None:
            args.append(f'--print-column={options.print_column}')
        if options.hide_column is not None:
            args.append(f'--hide-column={options.hide_column}')
        if options.hide_header:
            args.append('--hide-header')
        self._add_common_options(args, options)
        
        # Add columns
        for col in columns:
            args.append(f'--column={col}')
        
        # Add items
        for item in items:
            if isinstance(item, list):
                for val in item:
                    args.append(str(val))
            else:
                args.append(str(item))
        
        try:
            result = self._run(args)
            if result and options.multiple and options.separator:
                return result.split(options.separator)
            return result
        except subprocess.CalledProcessError:
            # Exit code 1 means user cancelled
            return None

    def file_selection(
        self, options: Optional[FileSelectionOptions] = None
    ) -> Optional[Union[str, List[str]]]:
        """Display a file or directory selection dialog.
        
        Args:
            options: FileSelectionOptions for customization (multiple, directory, save, etc.)
        
        Returns:
            Single file: str (file path)
            Multiple files: List[str] (list of file paths if multiple=True)
            Cancelled: None
        
        Example:
            >>> zenity = Zenity()
            >>> # Open single file
            >>> file = zenity.file_selection()
            >>> # Open multiple files
            >>> files = zenity.file_selection(FileSelectionOptions(multiple=True))
            >>> # Select directory
            >>> dir = zenity.file_selection(FileSelectionOptions(directory=True))
            >>> # Save file
            >>> path = zenity.file_selection(FileSelectionOptions(save=True, filename="doc.txt"))
        """
        if options is None:
            options = FileSelectionOptions()
        
        args = ['--file-selection']
        if options.multiple:
            args.append('--multiple')
        if options.directory:
            args.append('--directory')
        if options.save:
            args.append('--save')
        if options.filename:
            args.append(f'--filename={options.filename}')
        if options.confirm_overwrite:
            args.append('--confirm-overwrite')
        if options.separator:
            args.append(f'--separator={options.separator}')
        self._add_common_options(args, options)
        
        try:
            result = self._run(args)
            if result and options.multiple and options.separator:
                return result.split(options.separator)
            return result
        except subprocess.CalledProcessError:
            # Exit code 1 means user cancelled
            return None

    def color_selection(
        self, options: Optional[ColorSelectionOptions] = None
    ) -> Optional[str]:
        """Display a color picker dialog.
        
        Args:
            options: ColorSelectionOptions for customization (color, show_palette, etc.)
        
        Returns:
            Selected color in rgb format (e.g., 'rgb(255,87,51)'), or None if cancelled
        
        Note:
            Color selection may not work properly on macOS due to GTK limitations.
        
        Example:
            >>> zenity = Zenity()
            >>> color = zenity.color_selection(ColorSelectionOptions(color="#FF5733"))
        """
        if options is None:
            options = ColorSelectionOptions()
        
        args = ['--color-selection']
        if options.color:
            args.append(f'--color={self._convert_hex_color(options.color)}')
        if options.show_palette:
            args.append('--show-palette')
        self._add_common_options(args, options)
        
        try:
            return self._run(args)
        except subprocess.CalledProcessError:
            # Exit code 1 means user cancelled
            return None

    def calendar(self, text: str, options: Optional[CalendarOptions] = None) -> Optional[str]:
        """Display a calendar date picker dialog.
        
        Args:
            text: The prompt text to display
            options: CalendarOptions for customization (day, month, year, date_format, etc.)
        
        Returns:
            The selected date as a formatted string, or None if cancelled
        
        Example:
            >>> zenity = Zenity()
            >>> date = zenity.calendar("Select date:", 
            ...                        CalendarOptions(day=21, month=11, year=2025,
            ...                                       date_format="%Y-%m-%d"))
        """
        if options is None:
            options = CalendarOptions()
        
        args = ['--calendar']
        if text:
            args.append(f'--text={text}')
        if options.day:
            args.append(f'--day={options.day}')
        if options.month:
            args.append(f'--month={options.month}')
        if options.year:
            args.append(f'--year={options.year}')
        if options.date_format:
            args.append(f'--date-format={options.date_format}')
        self._add_common_options(args, options)
        
        try:
            return self._run(args)
        except subprocess.CalledProcessError:
            # Exit code 1 means user cancelled
            return None

    def scale(self, text: str, options: Optional[ScaleOptions] = None) -> Optional[int]:
        """Display a scale (slider) dialog for numeric input.
        
        Args:
            text: The prompt text to display
            options: ScaleOptions for customization (value, min_value, max_value, step, etc.)
        
        Returns:
            The selected number, or None if cancelled
        
        Example:
            >>> zenity = Zenity()
            >>> volume = zenity.scale("Adjust volume:", 
            ...                       ScaleOptions(value=50, min_value=0, 
            ...                                   max_value=100, step=5))
        """
        if options is None:
            options = ScaleOptions()
        
        args = ['--scale']
        if text:
            args.append(f'--text={text}')
        if options.value is not None:
            args.append(f'--value={options.value}')
        if options.min_value is not None:
            args.append(f'--min-value={options.min_value}')
        if options.max_value is not None:
            args.append(f'--max-value={options.max_value}')
        if options.step is not None:
            args.append(f'--step={options.step}')
        if options.print_partial:
            args.append('--print-partial')
        if options.hide_value:
            args.append('--hide-value')
        self._add_common_options(args, options)
        
        try:
            result = self._run(args)
            return int(result) if result else None
        except subprocess.CalledProcessError:
            # Exit code 1 means user cancelled
            return None

    def forms(
        self,
        fields: List[Dict[str, Any]],
        options: Optional[FormsOptions] = None
    ) -> Optional[List[str]]:
        """Display a multi-field form dialog.
        
        Args:
            fields: List of field dictionaries. Each field dict must have 'type' and 'label'.
                   Supported types: 'entry', 'password', 'multiline', 'calendar', 'list', 'combo'
                   Example: {'type': 'entry', 'label': 'Name'}
                           {'type': 'combo', 'label': 'Gender', 'values': ['M', 'F']}
            options: FormsOptions for customization (text, separator, etc.)
        
        Returns:
            List of values (one per field in order), or None if cancelled
        
        Example:
            >>> zenity = Zenity()
            >>> data = zenity.forms(
            ...     [{'type': 'entry', 'label': 'Name'},
            ...      {'type': 'password', 'label': 'Password'},
            ...      {'type': 'combo', 'label': 'Role', 'values': ['Admin', 'User']}],
            ...     FormsOptions(text="Login Form", separator="|"))
            >>> if data:
            ...     name, password, role = data
        """
        if options is None:
            options = FormsOptions()
        
        args = ['--forms']
        
        # Add text if provided in options
        if options.text:
            args.append(f'--text={options.text}')
        if options.separator:
            args.append(f'--separator={options.separator}')
        if options.forms_date_format:
            args.append(f'--forms-date-format={options.forms_date_format}')
        if options.show_header:
            args.append('--show-header')
        self._add_common_options(args, options)
        
        for field in fields:
            field_type = field.get('type')
            if field_type == 'entry':
                args.append(f'--add-entry={field["label"]}')
            elif field_type == 'password':
                args.append(f'--add-password={field["label"]}')
            elif field_type == 'multiline':
                args.append(f'--add-multiline-entry={field["label"]}')
            elif field_type == 'calendar':
                args.append(f'--add-calendar={field["label"]}')
            elif field_type == 'list':
                # Add list with header if provided, otherwise just label
                list_arg = f'{field["label"]}:{field.get("header")}' if field.get("header") else field["label"]
                args.append(f'--add-list={list_arg}')
                
                # Add list values
                if field.get('values'):
                    args.append(f'--list-values={"|".join(field["values"])}')
                
                # Add column values
                if field.get('column_values'):
                    args.append(f'--column-values={"|".join(field["column_values"])}')
            elif field_type == 'combo':
                args.append(f'--add-combo={field["label"]}')
                
                # Add combo values
                if field.get('values'):
                    args.append(f'--combo-values={"|".join(field["values"])}')
        
        try:
            result = self._run(args)
            if result:
                separator = options.separator or '|'
                return result.split(separator)
            return None
        except subprocess.CalledProcessError:
            # Exit code 1 means user cancelled
            return None

    def progress(self, text: str, options: Optional[ProgressOptions] = None) -> subprocess.Popen:
        """Display a progress dialog.
        
        Args:
            text: The progress message to display
            options: ProgressOptions for customization (percentage, pulsate, auto_close, etc.)
        
        Returns:
            subprocess.Popen object with stdin for sending updates.
            Write percentage to stdin: process.stdin.write('50\\n')
            Update message: process.stdin.write('# Loading...\\n')
            Complete: process.stdin.close(); process.wait()
        
        Example:
            >>> zenity = Zenity()
            >>> progress = zenity.progress("Loading...", ProgressOptions(percentage=0))
            >>> for i in range(0, 101, 10):
            ...     progress.stdin.write(f'{i}\\n')
            ...     progress.stdin.flush()
            >>> progress.stdin.close()
            >>> progress.wait()
        """
        if options is None:
            options = ProgressOptions()
        
        args = ['--progress']
        if text:
            args.append(f'--text={text}')
        if options.percentage is not None:
            args.append(f'--percentage={options.percentage}')
        if options.auto_close:
            args.append('--auto-close')
        if options.auto_kill:
            args.append('--auto-kill')
        if options.pulsate:
            args.append('--pulsate')
        if options.no_cancel:
            args.append('--no-cancel')
        if options.time_remaining:
            args.append('--time-remaining')
        self._add_common_options(args, options)
        
        # Fix for macOS: GTK4 Zenity crashes without these environment variables
        env = os.environ.copy()
        env['GSETTINGS_BACKEND'] = 'memory'
        env['GSETTINGS_SCHEMA_DIR'] = '/dev/null'
        env['G_MESSAGES_DEBUG'] = ''
        
        # For progress dialogs, return the process handle for manual control
        proc = subprocess.Popen(
            ['zenity'] + args,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.DEVNULL,
            env=env,
            text=True
        )
        return proc

    def update_progress(self, process: subprocess.Popen, percentage: int, text: str = '') -> None:
        """Update a progress dialog with new percentage and optional text.
        
        Args:
            process: The Popen object returned by progress()
            percentage: Progress percentage (0-100)
            text: Optional message to display
        
        Example:
            >>> zenity = Zenity()
            >>> progress = zenity.progress("Working...", ProgressOptions(percentage=0))
            >>> zenity.update_progress(progress, 50, "Half done")
            >>> zenity.update_progress(progress, 100, "Complete")
            >>> progress.stdin.close()
            >>> progress.wait()
        """
        if process.stdin:
            process.stdin.write(f'{percentage}\n')
            if text:
                process.stdin.write(f'# {text}\n')
            process.stdin.flush()

    # --------------------------------- Convenience helpers ---------------------------------
    class ProgressContext:
        """Context manager for progress dialogs.

        Provides automatic closing and waiting on exit.
        """
        def __init__(self, process: subprocess.Popen):
            self.process = process

        def update(self, percentage: int, text: str = '') -> None:
            if self.process.stdin:
                self.process.stdin.write(f'{percentage}\n')
                if text:
                    self.process.stdin.write(f'# {text}\n')
                self.process.stdin.flush()

        def close(self) -> None:
            if self.process.stdin:
                self.process.stdin.close()
            self.process.wait()

        def __enter__(self):
            return self

        def __exit__(self, exc_type, exc, tb):
            self.close()

    def progress_context(self, text: str, options: Optional[ProgressOptions] = None) -> "ProgressContext":
        """Return a context manager wrapper around `progress` for simpler usage.

        Example:
            >>> with zenity.progress_context("Working...", ProgressOptions(percentage=0)) as p:
            ...     p.update(50, "Half done")
            ...     p.update(100, "Complete")
        """
        return self.ProgressContext(self.progress(text, options))

    def _add_common_options(self, args: List[str], options: CommonOptions) -> None:
        """Add common options to args list"""
        if options.title:
            args.append(f'--title={options.title}')
        if options.width:
            args.append(f'--width={options.width}')
        if options.height:
            args.append(f'--height={options.height}')
        if options.timeout:
            args.append(f'--timeout={options.timeout}')
        if options.ok_label:
            args.append(f'--ok-label={options.ok_label}')
        if options.cancel_label:
            args.append(f'--cancel-label={options.cancel_label}')
        if options.extra_button:
            args.append(f'--extra-button={options.extra_button}')
        if options.modal_hint:
            args.append('--modal')
        if options.attach_parent:
            args.append(f'--attach={options.attach_parent}')

    # ------------------------------- Internal helper functions ------------------------------
    def _run(self, args: List[str]) -> str:
        """Run Zenity command and return stripped stdout."""
        result = subprocess.run(
            ['zenity'] + args,
            capture_output=True,
            text=True,
            check=True,
            env=self._zenity_env()
        )
        return result.stdout.strip()

    def _zenity_env(self) -> Dict[str, str]:
        """Return environment dict with required macOS GTK4 fixes applied."""
        env = os.environ.copy()
        env['GSETTINGS_BACKEND'] = 'memory'
        env['GSETTINGS_SCHEMA_DIR'] = '/dev/null'
        env['G_MESSAGES_DEBUG'] = ''
        return env

    def _message_dialog(self, kind_flag: str, message: str, options: InfoOptions) -> None:
        """Generic handler for info/warning/error dialogs."""
        args = [kind_flag, f'--text={message}']
        self._add_common_options(args, options)
        self._add_info_flags(args, options)
        try:
            self._run(args)
        except subprocess.CalledProcessError:
            pass

    def _add_info_flags(self, args: List[str], options: Union[InfoOptions, QuestionOptions]) -> None:
        if getattr(options, 'no_wrap', False):
            args.append('--no-wrap')
        if getattr(options, 'no_markup', False):
            args.append('--no-markup')
        if getattr(options, 'ellipsize', False):
            args.append('--ellipsize')
        icon_name = getattr(options, 'icon_name', None)
        if icon_name:
            args.append(f'--icon-name={icon_name}')

    def _convert_hex_color(self, color: str) -> str:
        """Convert '#RRGGBB' hex color to zenity rgb(0-65535) format."""
        if color.startswith('#') and len(color) >= 7:
            hex_color = color[1:7]
            try:
                r = int(hex_color[0:2], 16) * 257
                g = int(hex_color[2:4], 16) * 257
                b = int(hex_color[4:6], 16) * 257
                return f'rgb({r},{g},{b})'
            except ValueError:
                return color  # fallback to original
        return color

__all__ = [
    'Zenity',
    'CommonOptions', 'InfoOptions', 'QuestionOptions', 'EntryOptions', 'PasswordOptions',
    'ScaleOptions', 'CalendarOptions', 'ListOptions', 'ColorSelectionOptions', 'FileSelectionOptions',
    'ProgressOptions', 'FormsOptions', 'TextOptions'
]
