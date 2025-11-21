"""
Python wrapper for Zenity dialogs.
Provides a clean API for creating native desktop dialogs using Zenity.
"""

# Re-export everything from the main module for easier imports
from typing import TYPE_CHECKING

# Import all classes and types
import sys
import os
import importlib.util

# Load the zenity-wrapper module
_spec = importlib.util.spec_from_file_location(
    "zenity_wrapper_impl",
    os.path.join(os.path.dirname(__file__), "zenity-wrapper.py")
)
_module = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_module)

# Export all public items
Zenity = _module.Zenity
CommonOptions = _module.CommonOptions
InfoOptions = _module.InfoOptions
WarningOptions = _module.InfoOptions  # Alias
ErrorOptions = _module.InfoOptions  # Alias
QuestionOptions = _module.QuestionOptions
EntryOptions = _module.EntryOptions
PasswordOptions = _module.PasswordOptions
ScaleOptions = _module.ScaleOptions
CalendarOptions = _module.CalendarOptions
ListOptions = _module.ListOptions
ColorSelectionOptions = _module.ColorSelectionOptions
FileSelectionOptions = _module.FileSelectionOptions
ProgressOptions = _module.ProgressOptions
FormsOptions = _module.FormsOptions
TextOptions = _module.TextOptions

__all__ = [
    'Zenity',
    'CommonOptions',
    'InfoOptions',
    'WarningOptions',
    'ErrorOptions',
    'QuestionOptions',
    'EntryOptions',
    'PasswordOptions',
    'ScaleOptions',
    'CalendarOptions',
    'ListOptions',
    'ColorSelectionOptions',
    'FileSelectionOptions',
    'ProgressOptions',
    'FormsOptions',
    'TextOptions',
]
