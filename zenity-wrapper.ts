// zenity-wrapper.ts

import type { Subprocess } from "bun";

// Common options for all dialogs
export interface CommonOptions {
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

// Message dialog options
export interface InfoOptions extends CommonOptions {
  noWrap?: boolean;
  noMarkup?: boolean;
  ellipsize?: boolean;
  iconName?: string;
}

export interface WarningOptions extends InfoOptions {}
export interface ErrorOptions extends InfoOptions {}

export interface QuestionOptions extends CommonOptions {
  defaultCancel?: boolean;
  noWrap?: boolean;
  noMarkup?: boolean;
  ellipsize?: boolean;
}

// Input dialog options
export interface EntryOptions extends CommonOptions {
  entryText?: string;
  hideText?: boolean;
}

export interface PasswordOptions extends CommonOptions {
  username?: boolean;
}

export interface ScaleOptions extends CommonOptions {
  value?: number;
  minValue?: number;
  maxValue?: number;
  step?: number;
  printPartial?: boolean;
  hideValue?: boolean;
}

export interface CalendarOptions extends CommonOptions {
  day?: number;
  month?: number;
  year?: number;
  dateFormat?: string;
}

// Selection dialog options
export interface ListOptions extends CommonOptions {
  checklist?: boolean;
  radiolist?: boolean;
  imagelist?: boolean;
  multiple?: boolean;
  editable?: boolean;
  separator?: string;
  printColumn?: number;
  hideColumn?: number;
  hideHeader?: boolean;
}

export interface ColorSelectionOptions extends CommonOptions {
  color?: string;
  showPalette?: boolean;
}

// File dialog options
export interface FileSelectionOptions extends CommonOptions {
  multiple?: boolean;
  directory?: boolean;
  save?: boolean;
  separator?: string;
  filename?: string;
  confirmOverwrite?: boolean;
}

// Progress dialog options
export interface ProgressOptions extends CommonOptions {
  percentage?: number;
  pulsate?: boolean;
  autoClose?: boolean;
  autoKill?: boolean;
  noCancel?: boolean;
  timeRemaining?: boolean;
}

// Forms dialog
export type FormField = 
  | { type: 'entry'; label: string; value?: string }
  | { type: 'password'; label: string }
  | { type: 'multiline'; label: string; value?: string }
  | { type: 'calendar'; label: string }
  | { type: 'list'; label: string; header?: string; values?: string[]; columnValues?: string[] }
  | { type: 'combo'; label: string; values?: string[] };

export interface FormsOptions extends CommonOptions {
  text?: string;
  separator?: string;
  formsDateFormat?: string;
  showHeader?: boolean;
}

export interface FormsResult {
  button: 'ok' | 'cancel' | 'extra';
  values: string[] | null;
}


// Text dialog options
export interface TextOptions extends CommonOptions {
  filename?: string;
  editable?: boolean;
  fontName?: string;
  checkbox?: string;
  html?: boolean;
  htmlMode?: boolean;
  url?: string;
  autoScroll?: boolean;
}

interface SpawnOptions {
  stdio?: Array<'pipe' | 'inherit'>;
}

class Zenity {
  constructor() {}

  // Text Dialog
  async text(message: string, options: TextOptions = {}): Promise<string | null> {
    const args = ['--text-info'];
    if (options.filename) args.push(`--filename=${options.filename}`);
    if (options.editable) args.push('--editable');
    if (options.html || options.htmlMode) args.push('--html');
    if (options.url) args.push(`--url=${options.url}`);
    if (options.fontName) args.push(`--font=${options.fontName}`);
    if (options.checkbox) args.push(`--checkbox=${options.checkbox}`);
    if (options.autoScroll) args.push('--auto-scroll');
    this.addCommonOptions(args, options);
    try {
      return await this.runWithInput(args, message);
    } catch (error) {
      // Exit code 1 means user cancelled
      return null;
    }
  }

  // Info Dialog
  async info(message: string, options: InfoOptions = {}): Promise<void> {
    const args = ['--info', `--text=${message}`];
    this.addCommonOptions(args, options);
    if (options.noWrap) args.push('--no-wrap');
    if (options.noMarkup) args.push('--no-markup');
    if (options.ellipsize) args.push('--ellipsize');
    if (options.iconName) args.push(`--icon-name=${options.iconName}`);
    try {
      await this.run(args);
    } catch (error) {
      // Info dialogs don't need to throw
    }
  }

  // Warning Dialog
  async warning(message: string, options: WarningOptions = {}): Promise<void> {
    const args = ['--warning', `--text=${message}`];
    this.addCommonOptions(args, options);
    if (options.noWrap) args.push('--no-wrap');
    if (options.noMarkup) args.push('--no-markup');
    if (options.ellipsize) args.push('--ellipsize');
    if (options.iconName) args.push(`--icon-name=${options.iconName}`);
    try {
      await this.run(args);
    } catch (error) {
      // Warning dialogs don't need to throw
    }
  }

  // Error Dialog
  async error(message: string, options: ErrorOptions = {}): Promise<void> {
    const args = ['--error', `--text=${message}`];
    this.addCommonOptions(args, options);
    if (options.noWrap) args.push('--no-wrap');
    if (options.noMarkup) args.push('--no-markup');
    if (options.ellipsize) args.push('--ellipsize');
    if (options.iconName) args.push(`--icon-name=${options.iconName}`);
    try {
      await this.run(args);
    } catch (error) {
      // Error dialogs don't need to throw
    }
  }

  // Question Dialog
  async question(message: string, options: QuestionOptions = {}): Promise<boolean> {
    const args = ['--question', `--text=${message}`];
    this.addCommonOptions(args, options);
    if (options.defaultCancel) args.push('--default-cancel');
    if (options.noWrap) args.push('--no-wrap');
    if (options.noMarkup) args.push('--no-markup');
    if (options.ellipsize) args.push('--ellipsize');
    
    try {
      await this.run(args);
      return true; // User clicked Yes/OK
    } catch (error) {
      // Exit code 1 means user clicked No/Cancel, which is not an error
      return false;
    }
  }

  // Entry Dialog
  async entry(text: string, options: EntryOptions = {}): Promise<string | null> {
    const args = ['--entry'];
    if (text) args.push(`--text=${text}`);
    if (options.entryText) args.push(`--entry-text=${options.entryText}`);
    if (options.hideText) args.push('--hide-text');
    this.addCommonOptions(args, options);
    try {
      return await this.run(args);
    } catch (error) {
      // Exit code 1 means user cancelled
      return null;
    }
  }

  // Password Dialog
  async password(options: PasswordOptions = {}): Promise<string | null> {
    const args = ['--password'];
    if (options.username) args.push('--username');
    this.addCommonOptions(args, options);
    try {
      return await this.run(args);
    } catch (error) {
      // Exit code 1 means user cancelled
      return null;
    }
  }

  // List Dialog
  async list(
    text: string, 
    columns: string[], 
    items: (string | number | boolean)[][], 
    options: ListOptions = {}
  ): Promise<string | string[] | null> {
    const args = ['--list'];
    
    if (text) args.push(`--text=${text}`);
    if (options.checklist) args.push('--checklist');
    if (options.radiolist) args.push('--radiolist');
    if (options.imagelist) args.push('--imagelist');
    if (options.multiple) args.push('--multiple');
    if (options.editable) args.push('--editable');
    if (options.separator) args.push(`--separator=${options.separator}`);
    if (options.printColumn !== undefined) args.push(`--print-column=${options.printColumn}`);
    if (options.hideColumn !== undefined) args.push(`--hide-column=${options.hideColumn}`);
    if (options.hideHeader) args.push('--hide-header');
    this.addCommonOptions(args, options);
    
    // Add columns
    columns.forEach(col => args.push(`--column=${col}`));
    
    // Add items
    items.forEach(item => {
      if (Array.isArray(item)) {
        item.forEach(val => args.push(String(val)));
      } else {
        args.push(String(item));
      }
    });
    
    try {
      const result = await this.run(args);
      if (result && options.multiple && options.separator) {
        return result.split(options.separator);
      }
      return result;
    } catch (error) {
      // Exit code 1 means user cancelled
      return null;
    }
  }

  // File Selection Dialog
  async fileSelection(options: FileSelectionOptions = {}): Promise<string | string[] | null> {
    const args = ['--file-selection'];
    if (options.multiple) args.push('--multiple');
    if (options.directory) args.push('--directory');
    if (options.save) args.push('--save');
    if (options.filename) args.push(`--filename=${options.filename}`);
    if (options.confirmOverwrite) args.push('--confirm-overwrite');
    if (options.separator) args.push(`--separator=${options.separator}`);
    this.addCommonOptions(args, options);
    try {
      const result = await this.run(args);
      if (result && options.multiple && options.separator) {
        return result.split(options.separator);
      }
      return result;
    } catch (error) {
      // Exit code 1 means user cancelled
      return null;
    }
  }

  // Color Selection Dialog
  async colorSelection(options: ColorSelectionOptions = {}): Promise<string | null> {
    const args = ['--color-selection'];
    if (options.color) {
      // Zenity expects color values in the range 0-65535 (16-bit)
      let color = options.color;
      if (color.startsWith('#')) {
        const hex = color.slice(1);
        // Convert 8-bit (0-255) to 16-bit (0-65535) by multiplying by 257
        const r = parseInt(hex.slice(0, 2), 16) * 257;
        const g = parseInt(hex.slice(2, 4), 16) * 257;
        const b = parseInt(hex.slice(4, 6), 16) * 257;
        color = `rgb(${r},${g},${b})`;
      }
      args.push(`--color=${color}`);
    }
    if (options.showPalette) args.push('--show-palette');
    this.addCommonOptions(args, options);
    try {
      return await this.run(args);
    } catch (error) {
      // Exit code 1 means user cancelled
      return null;
    }
  }

  // Calendar Dialog
  async calendar(text: string, options: CalendarOptions = {}): Promise<string | null> {
    const args = ['--calendar'];
    if (text) args.push(`--text=${text}`);
    if (options.day) args.push(`--day=${options.day}`);
    if (options.month) args.push(`--month=${options.month}`);
    if (options.year) args.push(`--year=${options.year}`);
    if (options.dateFormat) args.push(`--date-format=${options.dateFormat}`);
    this.addCommonOptions(args, options);
    try {
      return await this.run(args);
    } catch (error) {
      // Exit code 1 means user cancelled
      return null;
    }
  }

  // Scale Dialog
  async scale(text: string, options: ScaleOptions = {}): Promise<number | null> {
    const args = ['--scale'];
    if (text) args.push(`--text=${text}`);
    if (options.value !== undefined) args.push(`--value=${options.value}`);
    if (options.minValue !== undefined) args.push(`--min-value=${options.minValue}`);
    if (options.maxValue !== undefined) args.push(`--max-value=${options.maxValue}`);
    if (options.step !== undefined) args.push(`--step=${options.step}`);
    if (options.printPartial) args.push('--print-partial');
    if (options.hideValue) args.push('--hide-value');
    this.addCommonOptions(args, options);
    try {
      const result = await this.run(args);
      return result ? parseInt(result, 10) : null;
    } catch (error) {
      // Exit code 1 means user cancelled
      return null;
    }
  }

  // Forms Dialog
  async forms(fields: FormField[], options: FormsOptions = {}): Promise<FormsResult> {
    const args = ['--forms'];
    
    // Add text if provided in options
    if (options.text) args.push(`--text=${options.text}`);
    if (options.separator) args.push(`--separator=${options.separator}`);
    if (options.formsDateFormat) args.push(`--forms-date-format=${options.formsDateFormat}`);
    if (options.showHeader) args.push('--show-header');
    this.addCommonOptions(args, options);
    
    fields.forEach(field => {
      if (field.type === 'entry') {
        args.push(`--add-entry=${field.label}`);
      } else if (field.type === 'password') {
        args.push(`--add-password=${field.label}`);
      } else if (field.type === 'multiline') {
        args.push(`--add-multiline-entry=${field.label}`);
      } else if (field.type === 'calendar') {
        args.push(`--add-calendar=${field.label}`);
      } else if (field.type === 'list') {
        // Add list with header if provided, otherwise just label
        const listArg = field.header ? `${field.label}:${field.header}` : field.label;
        args.push(`--add-list=${listArg}`);
        
        // Add list values
        if (field.values && field.values.length > 0) {
          args.push(`--list-values=${field.values.join('|')}`);
        }
        
        // Add column values
        if (field.columnValues && field.columnValues.length > 0) {
          args.push(`--column-values=${field.columnValues.join('|')}`);
        }
      } else if (field.type === 'combo') {
        args.push(`--add-combo=${field.label}`);
        
        // Add combo values
        if (field.values && field.values.length > 0) {
          args.push(`--combo-values=${field.values.join('|')}`);
        }
      }
    });
    
    try {
      const result = await this.runWithExitCode(args);
      const separator = options.separator || '|';
      
      if (result.exitCode === 0) {
        // OK button clicked
        return {
          button: 'ok',
          values: result.output.split(separator)
        };
      } else if (result.exitCode === 1 && result.output) {
        // Exit code 1 with output - check if it's the extra button label
        // If the output matches the extra button text, it's the extra button
        // Otherwise it might be form data from a different scenario
        if (options.extraButton && result.output === options.extraButton) {
          // Extra button clicked - output is just the button label, no form values
          return {
            button: 'extra',
            values: null
          };
        } else if (result.output.includes(separator) || !options.extraButton) {
          // Has separator or no extra button defined, treat as form data with exit code 1
          // This can happen in some edge cases
          return {
            button: 'ok',
            values: result.output.split(separator)
          };
        } else {
          // Unknown case, treat as cancel
          return {
            button: 'cancel',
            values: null
          };
        }
      } else {
        // Cancel button clicked (exit code 1 with no output) or any other exit code
        return {
          button: 'cancel',
          values: null
        };
      }
    } catch (error) {
      // Error occurred
      return {
        button: 'cancel',
        values: null
      };
    }
  }

  // Progress Dialog
  async progress(text: string, options: ProgressOptions = {}): Promise<Subprocess> {
    const args = ['--progress'];
    if (text) args.push(`--text=${text}`);
    if (options.percentage !== undefined) args.push(`--percentage=${options.percentage}`);
    if (options.autoClose) args.push('--auto-close');
    if (options.autoKill) args.push('--auto-kill');
    if (options.pulsate) args.push('--pulsate');
    if (options.noCancel) args.push('--no-cancel');
    if (options.timeRemaining) args.push('--time-remaining');
    this.addCommonOptions(args, options);
    
    try {
      // Fix for macOS: GTK4 Zenity crashes without these environment variables
      const zenityEnv = {
        ...Bun.env,
        GSETTINGS_BACKEND: 'memory',
        GSETTINGS_SCHEMA_DIR: '/dev/null',
        G_MESSAGES_DEBUG: '',
      };
      
      // For progress dialogs, return the process handle for manual control
      const proc = Bun.spawn(['zenity', ...args], {
        stdout: 'pipe',
        stderr: 'ignore', // Ignore GTK warnings on macOS
        stdin: 'pipe',
        env: zenityEnv,
      });
      return proc;
    } catch (error) {
      throw new Error(`Failed to create progress dialog: ${(error as Error).message}`);
    }
  }

  // Add common options to args array
  private addCommonOptions(args: string[], options: CommonOptions): void {
    if (options.title) args.push(`--title=${options.title}`);
    if (options.width) args.push(`--width=${options.width}`);
    if (options.height) args.push(`--height=${options.height}`);
    if (options.timeout) args.push(`--timeout=${options.timeout}`);
    if (options.okLabel) args.push(`--ok-label=${options.okLabel}`);
    if (options.cancelLabel) args.push(`--cancel-label=${options.cancelLabel}`);
    if (options.extraButton) args.push(`--extra-button=${options.extraButton}`);
    if (options.modalHint) args.push('--modal');
    if (options.attachParent) args.push(`--attach=${options.attachParent}`);
  }

  // Run Zenity command
  private async run(args: string[], spawnOptions: SpawnOptions = {}): Promise<string> {
    try {
      // Fix for macOS: GTK4 Zenity crashes without these environment variables
      // This tells GSettings to use memory backend and prevents schema lookups
      const zenityEnv = {
        ...Bun.env,
        GSETTINGS_BACKEND: 'memory',
        GSETTINGS_SCHEMA_DIR: '/dev/null',
        G_MESSAGES_DEBUG: '',
      };
      
      const proc = Bun.spawn(['zenity', ...args], {
        stdout: 'pipe',
        stderr: 'ignore', // Ignore GTK warnings on macOS
        stdin: spawnOptions.stdio?.[0] === 'pipe' ? 'pipe' : 'inherit',
        env: zenityEnv,
      });
      
      const stdout = await new Response(proc.stdout).text();
      const exitCode = await proc.exited;
      
      if (exitCode === 0) {
        return stdout.trim();
      } else {
        throw new Error(`Zenity exited with code ${exitCode}`);
      }
    } catch (error) {
      throw new Error(`Failed to run zenity: ${(error as Error).message}`);
    }
  }

  // Run Zenity command and return both output and exit code
  private async runWithExitCode(args: string[], spawnOptions: SpawnOptions = {}): Promise<{ output: string; exitCode: number }> {
    try {
      const zenityEnv = {
        ...Bun.env,
        GSETTINGS_BACKEND: 'memory',
        GSETTINGS_SCHEMA_DIR: '/dev/null',
        G_MESSAGES_DEBUG: '',
      };
      
      const proc = Bun.spawn(['zenity', ...args], {
        stdout: 'pipe',
        stderr: 'ignore',
        stdin: spawnOptions.stdio?.[0] === 'pipe' ? 'pipe' : 'inherit',
        env: zenityEnv,
      });
      
      const stdout = await new Response(proc.stdout).text();
      const exitCode = await proc.exited;
      
      return { output: stdout.trim(), exitCode };
    } catch (error) {
      throw new Error(`Failed to run zenity: ${(error as Error).message}`);
    }
  }

  // Run Zenity command with input piped to stdin
  private async runWithInput(args: string[], input: string): Promise<string> {
    try {
      const zenityEnv = {
        ...Bun.env,
        GSETTINGS_BACKEND: 'memory',
        GSETTINGS_SCHEMA_DIR: '/dev/null',
        G_MESSAGES_DEBUG: '',
      };
      
      const proc = Bun.spawn(['zenity', ...args], {
        stdout: 'pipe',
        stderr: 'ignore',
        stdin: 'pipe',
        env: zenityEnv,
      });
      
      // Write input to stdin
      if (proc.stdin && typeof proc.stdin !== 'number') {
        const encoder = new TextEncoder();
        proc.stdin.write(encoder.encode(input));
        proc.stdin.end();
      }
      
      const stdout = await new Response(proc.stdout).text();
      const exitCode = await proc.exited;
      
      if (exitCode === 0) {
        return stdout.trim();
      } else {
        throw new Error(`Zenity exited with code ${exitCode}`);
      }
    } catch (error) {
      throw new Error(`Failed to run zenity: ${(error as Error).message}`);
    }
  }

  // Method to update progress (for progress dialogs)
  updateProgress(process: Subprocess, percentage: number, text: string = ''): void {
    if (process.stdin && typeof process.stdin !== 'number') {
      const encoder = new TextEncoder();
      process.stdin.write(encoder.encode(`${percentage}\n`));
      if (text) {
        process.stdin.write(encoder.encode(`# ${text}\n`));
      }
    }
  }
}

export default Zenity;
export { Zenity };
