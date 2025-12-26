# Forms Extra Button Fix - Summary

## Problem
In the forms dialog, when using the `extraButton` option, there was no way to distinguish between the user clicking Cancel vs clicking the Extra button. Both cases returned `null`, making it impossible to implement different behaviors for these two actions.

## Root Cause
Zenity returns different behaviors for different buttons:
- Exit code 0 = OK button clicked (with form values in stdout)
- Exit code 1 + empty stdout = Cancel button clicked
- Exit code 1 + button label in stdout = Extra button clicked

The original implementation only checked for exit code 0 (success), treating all other exit codes as cancelled, thus losing the information about which button was actually clicked.

**Important Discovery:** The extra button in Zenity does NOT return form values. When clicked, it outputs only the button label to stdout with exit code 1. This is different from OK (exit code 0 with values) and Cancel (exit code 1 with empty output).

## Solution
Changed the `forms()` method to return a `FormsResult` object that includes:
1. `button`: A string indicating which button was clicked ('ok', 'cancel', or 'extra')
2. `values`: The form values (or null if cancelled or extra button clicked)

The implementation now checks:
- Exit code 0 → OK button with form values
- Exit code 1 + output matching extra button label → Extra button (no form values)
- Exit code 1 + empty output → Cancel button

### API Changes

**Before:**
```typescript
async forms(...): Promise<string[] | null>
```

**After:**
```typescript
interface FormsResult {
  button: 'ok' | 'cancel' | 'extra';
  values: string[] | null;
}

async forms(...): Promise<FormsResult>
```

### Migration Guide

**Old code:**
```typescript
const values = await zenity.forms([...], options);
if (values) {
  // Process values
}
```

**New code:**
```typescript
const result = await zenity.forms([...], options);
if (result.button === 'ok' && result.values) {
  // Process values
} else if (result.button === 'extra') {
  // Handle extra button action (note: no form values available)
  console.log('User clicked extra button');
} else {
  // Handle cancel
}
```

## Files Modified
1. `zenity-wrapper.ts`
   - Added `FormsResult` interface
   - Added `runWithExitCode()` helper method
   - Updated `forms()` to return `FormsResult` and check exit codes
   
2. `forms_collection.ts`
   - Added `handleFormsResult()` helper method
   - Updated all form methods to use new helper

3. `ZENITY_API.md`
   - Updated forms() documentation
   - Added FormsResult interface documentation
   - Updated examples to show new API

4. `README.md`
   - Added breaking change notice
   - Added example showing button differentiation

## Test Files Created
1. `test_extra_button.ts` - Simple test demonstrating the fix
2. `demo_button_handling.ts` - Comprehensive demo showing all three button types

## Benefits
- ✅ Can now distinguish between Cancel and Extra button
- ✅ More intuitive API with explicit button state
- ✅ Better user experience with different actions per button
- ✅ Maintains backward compatibility at the type level (just need to access `.values`)
- ⚠️ Note: Extra button does not return form values (this is Zenity's behavior)

## Example Use Cases
- "Skip" button to defer form completion vs "Cancel" to abort
- "Save Draft" vs "Cancel" in a blog post form (draft would need to be saved separately)
- "Fill Later" vs "Cancel" in an onboarding flow
- "Use Defaults" vs "Cancel" in configuration dialogs (defaults applied programmatically)
