import Zenity from './zenity-wrapper';

export class FormCollection {
  private zenity: Zenity;

  constructor(zenityInstance?: Zenity) {
    this.zenity = zenityInstance || new Zenity();
  }

  /**
   * Helper to parse the array result from Zenity into a structured object.
   */
  private parseResult(result: string[] | null, keys: string[]) {
    if (!result) return null;
    const output: Record<string, string> = {};
    keys.forEach((key, index) => {
      output[key] = result[index] || '';
    });
    return output;
  }

  /**
   * Helper to handle forms result with button information
   */
  private handleFormsResult(result: { button: 'ok' | 'cancel' | 'extra'; values: string[] | null }, keys: string[]) {
    if (result.button === 'cancel' || !result.values) return null;
    return this.parseResult(result.values, keys);
  }

  // ============================================================
  // PROJECT INITIALIZATION
  // ============================================================

  /**
   * NPM/Bun Package Initialization
   * Returns: { packageName, version, description, author, license, runtime }
   */
  async packageInit(title: string = "Package Initialization") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'Package Name' },
      { type: 'entry', label: 'Version', value: '0.1.0' },
      { type: 'entry', label: 'Description' },
      { type: 'entry', label: 'Author' },
      { type: 'combo', label: 'License', values: ['MIT', 'Apache-2.0', 'GPL-3.0', 'BSD-3-Clause', 'ISC', 'Unlicense'] },
      { type: 'combo', label: 'Runtime', values: ['Bun', 'Node', 'Deno'] }
    ], { title });

    return this.handleFormsResult(result, ['packageName', 'version', 'description', 'author', 'license', 'runtime']);
  }

  /**
   * TypeScript Configuration
   * Returns: { target, module, strict, outDir, rootDir }
   */
  async typescriptConfig(title: string = "TypeScript Config") {
    const result = await this.zenity.forms([
      { type: 'combo', label: 'Target', values: ['ES2022', 'ES2021', 'ES2020', 'ESNext'] },
      { type: 'combo', label: 'Module', values: ['ESNext', 'CommonJS', 'ES2022', 'NodeNext'] },
      { type: 'combo', label: 'Strict Mode', values: ['true', 'false'] },
      { type: 'entry', label: 'Out Directory', value: './dist' },
      { type: 'entry', label: 'Root Directory', value: './src' }
    ], { title });

    return this.handleFormsResult(result, ['target', 'module', 'strict', 'outDir', 'rootDir']);
  }

  /**
   * Python Project Setup
   * Returns: { projectName, pythonVersion, useVenv, framework, packageManager }
   */
  async pythonProjectSetup(title: string = "Python Project Setup") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'Project Name' },
      { type: 'combo', label: 'Python Version', values: ['3.12', '3.11', '3.10', '3.9'] },
      { type: 'combo', label: 'Package Manager', values: ['pip', 'poetry', 'uv'] },
      { type: 'combo', label: 'Framework', values: ['FastAPI', 'Flask', 'Django', 'None'] },
      { type: 'combo', label: 'Use Virtual Env', values: ['Yes', 'No'] }
    ], { title });

    return this.handleFormsResult(result, ['projectName', 'pythonVersion', 'packageManager', 'framework', 'useVenv']);
  }

  /**
   * Web Project Setup
   * Returns: { projectName, framework, typescript, styling, linter }
   */
  async webProjectSetup(title: string = "Web Project Setup") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'Project Name' },
      { type: 'combo', label: 'Framework', values: ['React', 'Vue', 'Svelte', 'Solid', 'Vanilla'] },
      { type: 'combo', label: 'TypeScript', values: ['Yes', 'No'] },
      { type: 'combo', label: 'Styling', values: ['Tailwind', 'UnoCSS', 'CSS Modules', 'Sass', 'None'] },
      { type: 'combo', label: 'Linter', values: ['ESLint + Prettier', 'Biome', 'None'] }
    ], { title });

    return this.handleFormsResult(result, ['projectName', 'framework', 'typescript', 'styling', 'linter']);
  }

  // ============================================================
  // GIT & VERSION CONTROL
  // ============================================================

  /**
   * Conventional Git Commit
   * Returns: { type, scope, summary, description, breaking }
   */
  async gitCommit(title: string = "Git Commit") {
    const result = await this.zenity.forms([
      { type: 'combo', label: 'Type', values: ['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'perf'] },
      { type: 'entry', label: 'Scope (optional)' },
      { type: 'entry', label: 'Summary' },
      { type: 'multiline', label: 'Description (optional)' },
      { type: 'combo', label: 'Breaking Change', values: ['No', 'Yes'] }
    ], { title });

    return this.handleFormsResult(result, ['type', 'scope', 'summary', 'description', 'breaking']);
  }

  /**
   * Pull Request
   * Returns: { title, type, description, closes, reviewers }
   */
  async pullRequest(title: string = "Pull Request") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'Title' },
      { type: 'combo', label: 'Type', values: ['Feature', 'Bugfix', 'Hotfix', 'Refactor', 'Docs', 'Chore'] },
      { type: 'multiline', label: 'Description' },
      { type: 'entry', label: 'Closes Issue #' },
      { type: 'entry', label: 'Reviewers (comma separated)' }
    ], { title });

    return this.handleFormsResult(result, ['title', 'type', 'description', 'closes', 'reviewers']);
  }

  /**
   * Release Version
   * Returns: { currentVersion, newVersion, type, changelog }
   */
  async releaseVersion(title: string = "Release Version") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'Current Version', value: '0.1.0' },
      { type: 'combo', label: 'Release Type', values: ['patch', 'minor', 'major', 'custom'] },
      { type: 'entry', label: 'New Version (if custom)' },
      { type: 'multiline', label: 'Changelog Summary' }
    ], { title });

    return this.handleFormsResult(result, ['currentVersion', 'type', 'newVersion', 'changelog']);
  }

  /**
   * .gitignore Generator
   * Returns: { language, framework, editor, os, extras }
   */
  async gitignoreGenerator(title: string = ".gitignore Generator") {
    const result = await this.zenity.forms([
      { type: 'combo', label: 'Language', values: ['Node', 'Python', 'Go', 'Rust', 'Java', 'Generic'] },
      { type: 'combo', label: 'Framework', values: ['None', 'Next.js', 'Vite', 'Django', 'Flask'] },
      { type: 'combo', label: 'Editor', values: ['VSCode', 'JetBrains', 'Vim', 'None'] },
      { type: 'combo', label: 'OS', values: ['macOS', 'Linux', 'Windows', 'All'] },
      { type: 'entry', label: 'Extra Patterns (comma separated)' }
    ], { title });
    return this.handleFormsResult(result, ['language', 'framework', 'editor', 'os', 'extras']);
  }

  // ============================================================
  // CONFIGURATION FILES
  // ============================================================

  /**
   * Environment Variables
   * Returns: { environment, variables }
   */
  async envConfig(title: string = "Environment Config") {
    const result = await this.zenity.forms([
      { type: 'combo', label: 'Environment', values: ['Development', 'Staging', 'Production', 'Test'] },
      { type: 'multiline', label: 'Variables (KEY=VALUE per line)' }
    ], { title });
    return this.handleFormsResult(result, ['environment', 'variables']);
  }

  /**
   * ESLint + Prettier Configuration
   * Returns: { semi, singleQuote, trailingComma, tabWidth, printWidth }
   */
  async lintConfig(title: string = "Lint/Format Config") {
    const result = await this.zenity.forms([
      { type: 'combo', label: 'Semicolons', values: ['true', 'false'] },
      { type: 'combo', label: 'Single Quotes', values: ['true', 'false'] },
      { type: 'combo', label: 'Trailing Comma', values: ['all', 'es5', 'none'] },
      { type: 'combo', label: 'Tab Width', values: ['2', '4'] },
      { type: 'combo', label: 'Print Width', values: ['80', '100', '120'] }
    ], { title });
    return this.handleFormsResult(result, ['semi', 'singleQuote', 'trailingComma', 'tabWidth', 'printWidth']);
  }

  /**
   * VS Code Workspace Settings
   * Returns: { formatOnSave, tabSize, insertSpaces, trimWhitespace }
   */
  async vscodeSettings(title: string = "VS Code Settings") {
    const result = await this.zenity.forms([
      { type: 'combo', label: 'Format On Save', values: ['true', 'false'] },
      { type: 'combo', label: 'Tab Size', values: ['2', '4'] },
      { type: 'combo', label: 'Insert Spaces', values: ['true', 'false'] },
      { type: 'combo', label: 'Trim Trailing Whitespace', values: ['true', 'false'] },
      { type: 'combo', label: 'Auto Save', values: ['afterDelay', 'onFocusChange', 'off'] }
    ], { title });
    return this.handleFormsResult(result, ['formatOnSave', 'tabSize', 'insertSpaces', 'trimWhitespace', 'autoSave']);
  }

  /**
   * Package Scripts Editor
   * Returns: { dev, build, test, lint, format }
   */
  async packageScripts(title: string = "Package Scripts") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'dev', value: 'vite' },
      { type: 'entry', label: 'build', value: 'vite build' },
      { type: 'entry', label: 'test', value: 'vitest' },
      { type: 'entry', label: 'lint', value: 'eslint .' },
      { type: 'entry', label: 'format', value: 'prettier --write .' }
    ], { title });
    return this.handleFormsResult(result, ['dev', 'build', 'test', 'lint', 'format']);
  }

  // ============================================================
  // DEPLOYMENT & DEVOPS
  // ============================================================

  /**
   * Docker Container Configuration
   * Returns: { containerName, image, ports, volumes, restart }
   */
  async dockerConfig(title: string = "Docker Container") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'Container Name' },
      { type: 'entry', label: 'Image', value: 'node:20-alpine' },
      { type: 'entry', label: 'Port Mapping', value: '3000:3000' },
      { type: 'entry', label: 'Volume Mapping' },
      { type: 'combo', label: 'Restart Policy', values: ['unless-stopped', 'always', 'on-failure', 'no'] }
    ], { title });

    return this.handleFormsResult(result, ['containerName', 'image', 'ports', 'volumes', 'restart']);
  }

  /**
   * GitHub Actions Workflow
   * Returns: { name, trigger, os, nodeVersion, steps }
   */
  async githubActions(title: string = "GitHub Actions") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'Workflow Name', value: 'CI' },
      { type: 'combo', label: 'Trigger', values: ['push', 'pull_request', 'workflow_dispatch', 'schedule'] },
      { type: 'combo', label: 'Runner OS', values: ['ubuntu-latest', 'macos-latest', 'windows-latest'] },
      { type: 'entry', label: 'Node Version', value: '20' },
      { type: 'multiline', label: 'Custom Steps (optional)' }
    ], { title });
    return this.handleFormsResult(result, ['name', 'trigger', 'os', 'nodeVersion', 'steps']);
  }

  /**
   * SSH Configuration
   * Returns: { host, hostname, user, port, identityFile }
   */
  async sshConfig(title: string = "SSH Config") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'Host Alias' },
      { type: 'entry', label: 'Hostname/IP' },
      { type: 'entry', label: 'User' },
      { type: 'entry', label: 'Port', value: '22' },
      { type: 'entry', label: 'Identity File', value: '~/.ssh/id_rsa' }
    ], { title });
    return this.handleFormsResult(result, ['host', 'hostname', 'user', 'port', 'identityFile']);
  }

  // ============================================================
  // DATABASE & SERVICES
  // ============================================================

  /**
   * Database Connection
   * Returns: { type, host, port, database, username, password, ssl }
   */
  async databaseConfig(title: string = "Database Config") {
    const result = await this.zenity.forms([
      { type: 'combo', label: 'Type', values: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite'] },
      { type: 'entry', label: 'Host', value: 'localhost' },
      { type: 'entry', label: 'Port', value: '5432' },
      { type: 'entry', label: 'Database Name' },
      { type: 'entry', label: 'Username' },
      { type: 'password', label: 'Password' },
      { type: 'combo', label: 'SSL', values: ['false', 'true', 'require'] }
    ], { title });

    return this.handleFormsResult(result, ['type', 'host', 'port', 'database', 'username', 'password', 'ssl']);
  }

  /**
   * API Configuration
   * Returns: { service, apiKey, baseUrl, environment, rateLimit }
   */
  async apiConfig(title: string = "API Configuration") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'Service Name' },
      { type: 'password', label: 'API Key' },
      { type: 'entry', label: 'Base URL' },
      { type: 'combo', label: 'Environment', values: ['Development', 'Staging', 'Production'] },
      { type: 'entry', label: 'Rate Limit (req/min)', value: '60' }
    ], { title });

    return this.handleFormsResult(result, ['service', 'apiKey', 'baseUrl', 'environment', 'rateLimit']);
  }

  // ============================================================
  // DOCUMENTATION
  // ============================================================

  /**
   * README Generator
   * Returns: { projectName, description, installation, usage, license }
   */
  async readmeGenerator(title: string = "README Generator") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'Project Name' },
      { type: 'multiline', label: 'Description' },
      { type: 'multiline', label: 'Installation' },
      { type: 'multiline', label: 'Usage Example' },
      { type: 'combo', label: 'License', values: ['MIT', 'Apache-2.0', 'GPL-3.0', 'ISC', 'Unlicense'] }
    ], { title });
    return this.handleFormsResult(result, ['projectName', 'description', 'installation', 'usage', 'license']);
  }

  /**
   * Changelog Entry
   * Returns: { version, date, added, changed, fixed, removed }
   */
  async changelogEntry(title: string = "Changelog Entry") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'Version', value: '0.1.0' },
      { type: 'calendar', label: 'Date' },
      { type: 'multiline', label: 'Added' },
      { type: 'multiline', label: 'Changed' },
      { type: 'multiline', label: 'Fixed' },
      { type: 'multiline', label: 'Removed' }
    ], { title });
    return this.handleFormsResult(result, ['version', 'date', 'added', 'changed', 'fixed', 'removed']);
  }

  /**
   * Blog Post Metadata
   * Returns: { title, author, category, tags, publishDate, draft }
   */
  async blogPost(title: string = "Blog Post") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'Title' },
      { type: 'entry', label: 'Author' },
      { type: 'combo', label: 'Category', values: ['Tech', 'Tutorial', 'News', 'Review', 'Opinion'] },
      { type: 'entry', label: 'Tags (comma separated)' },
      { type: 'calendar', label: 'Publish Date' },
      { type: 'combo', label: 'Draft', values: ['true', 'false'] }
    ], { title });

    return this.handleFormsResult(result, ['title', 'author', 'category', 'tags', 'publishDate', 'draft']);
  }

  // ============================================================
  // ISSUE TRACKING
  // ============================================================

  /**
   * Bug Report
   * Returns: { title, severity, type, steps, expected, actual }
   */
  async bugReport(title: string = "Bug Report") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'Title' },
      { type: 'combo', label: 'Severity', values: ['Critical', 'High', 'Medium', 'Low'] },
      { type: 'combo', label: 'Type', values: ['Bug', 'Regression', 'Performance', 'Security'] },
      { type: 'multiline', label: 'Steps to Reproduce' },
      { type: 'multiline', label: 'Expected Behavior' },
      { type: 'multiline', label: 'Actual Behavior' }
    ], { title });

    return this.handleFormsResult(result, ['title', 'severity', 'type', 'steps', 'expected', 'actual']);
  }

  /**
   * Feature Request
   * Returns: { title, priority, category, description, useCase }
   */
  async featureRequest(title: string = "Feature Request") {
    const result = await this.zenity.forms([
      { type: 'entry', label: 'Title' },
      { type: 'combo', label: 'Priority', values: ['High', 'Medium', 'Low'] },
      { type: 'combo', label: 'Category', values: ['Enhancement', 'New Feature', 'Improvement'] },
      { type: 'multiline', label: 'Description' },
      { type: 'multiline', label: 'Use Case' }
    ], { title });

    return this.handleFormsResult(result, ['title', 'priority', 'category', 'description', 'useCase']);
  }
}

// Demo execution block
if (import.meta.main) {
    const forms = new FormCollection();
    const zenity = new Zenity();
    
    try {
        const selection = await zenity.list(
            "Select a form to demo:",
            ["Form", "Category"],
            [
                // Project Setup
                ["Package Init", "Setup"],
                ["TypeScript Config", "Setup"],
                ["Python Project", "Setup"],
                ["Web Project", "Setup"],
                
                // Git & Version Control
                ["Git Commit", "Git"],
                ["Pull Request", "Git"],
                ["Release Version", "Git"],
                [".gitignore", "Git"],
                
                // Configuration
                ["Environment Config", "Config"],
                ["Lint Config", "Config"],
                ["VS Code Settings", "Config"],
                ["Package Scripts", "Config"],
                
                // Deployment & DevOps
                ["Docker Config", "DevOps"],
                ["GitHub Actions", "DevOps"],
                ["SSH Config", "DevOps"],
                
                // Database & Services
                ["Database Config", "Services"],
                ["API Config", "Services"],
                
                // Documentation
                ["README", "Docs"],
                ["Changelog Entry", "Docs"],
                ["Blog Post", "Docs"],
                
                // Issue Tracking
                ["Bug Report", "Issues"],
                ["Feature Request", "Issues"]
            ],
            { 
                title: "Developer Forms Collection",
                width: 500,
                height: 600
            }
        );

        if (selection) {
            let result;
            const formName = selection.toString();

            const formMap: Record<string, () => Promise<any>> = {
                "Package Init": () => forms.packageInit(),
                "TypeScript Config": () => forms.typescriptConfig(),
                "Python Project": () => forms.pythonProjectSetup(),
                "Web Project": () => forms.webProjectSetup(),
                
                "Git Commit": () => forms.gitCommit(),
                "Pull Request": () => forms.pullRequest(),
                "Release Version": () => forms.releaseVersion(),
                ".gitignore": () => forms.gitignoreGenerator(),
                
                "Environment Config": () => forms.envConfig(),
                "Lint Config": () => forms.lintConfig(),
                "VS Code Settings": () => forms.vscodeSettings(),
                "Package Scripts": () => forms.packageScripts(),
                
                "Docker Config": () => forms.dockerConfig(),
                "GitHub Actions": () => forms.githubActions(),
                "SSH Config": () => forms.sshConfig(),
                
                "Database Config": () => forms.databaseConfig(),
                "API Config": () => forms.apiConfig(),
                
                "README": () => forms.readmeGenerator(),
                "Changelog Entry": () => forms.changelogEntry(),
                "Blog Post": () => forms.blogPost(),
                
                "Bug Report": () => forms.bugReport(),
                "Feature Request": () => forms.featureRequest()
            };
            
            const formFunc = formMap[formName];
            if (formFunc) {
                result = await formFunc();
            }
            
            if (result) {
                console.log("Form Result:", result);
                await zenity.info(`<b>Form Data:</b>\n\n${JSON.stringify(result, null, 2)}`, { 
                    title: "Result",
                    noWrap: false,
                    width: 500
                });
            } else {
                console.log("Form cancelled");
            }
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
