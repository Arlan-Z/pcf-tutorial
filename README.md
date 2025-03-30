# PCF Create, Build, Deploy Cheat Sheet

This document provides a quick reference for creating, building, and deploying Power Apps Component Framework (PCF) controls.

**Last Updated:** February 21, 2024

## Prerequisites

*   **Power Platform CLI:** Must be installed. You can find installation instructions [here](https://docs.microsoft.com/en-us/power-platform/developer/cli/introduction).
*   **MSBuild:** Required for building solutions. Typically installed with Visual Studio.
*   **Node.js & npm:** Required for managing dependencies and running build scripts.

*(Aliases are used in the commands below where applicable for brevity.)*

## `pac pcf init` Command Usage

This command initializes a new PCF control project.

**Syntax:**

```bash
pac pcf init [--namespace] [--name] [--template] [--framework] [--outputDirectory] [--run-npm-install]
```

**Parameters:**

*   `--namespace` (alias: `-ns`): The namespace for the component (e.g., `YourCompany.Controls`).
*   `--name` (alias: `-n`): The name for the component (e.g., `MyCoolControl`).
*   `--template` (alias: `-t`): Choose a template for the component.
    *   Values: `field`, `dataset`
*   `--framework` (alias: `-fw`): The rendering framework for the control.
    *   Values: `none` (default, uses plain HTML/TypeScript), `react`
*   `--outputDirectory` (alias: `-o`): Specifies the output directory for the project files.
*   `--run-npm-install` (alias: `-npm`): Automatically run `npm install` after the control is created.
    *   Default value: `false`

---

## Initializing a Project

### Field Templates

#### Standard Field (No Framework)

*   **Without automatic `npm install`:**
    ```bash
    pac pcf init -n <control name> -ns <namespace> -t field
    ```
    *Note: You will need to run `npm install` manually.*
    *   `<control name>` is used in the class in `index.ts` and in the `constructor`, `display-name-key`, and `description-key` in `ControlManifest.input.xml`.
    *   `<namespace>` is used in the `ControlManifest.input.xml`.

*   **With automatic `npm install`:**
    ```bash
    pac pcf init -n <control name> -ns <namespace> -t field -npm
    ```

#### React Field

*   **With automatic `npm install`:**
    ```bash
    pac pcf init -n <control name> -ns <namespace> -t field -fw react -npm
    ```

### Dataset Templates

#### Standard Dataset (No Framework)

*   **With automatic `npm install`:**
    ```bash
    pac pcf init -n <control name> -ns <namespace> -t dataset -npm
    ```

#### React Dataset

*   **With automatic `npm install`:**
    ```bash
    pac pcf init -n <control name> -ns <namespace> -t dataset -fw react -npm
    ```

---

## Build and Package

Navigate to your control's project directory (the one containing `package.json`).

1.  **Build the control:**
    ```bash
    npm run build
    ```

2.  **Test locally using the test harness:**
    ```bash
    npm start watch
    ```
    *This command starts a local server, opens the test harness in your browser, and watches for file changes to rebuild automatically.*

### Packaging into a Solution

**Important:** Increment the `version` attribute in the `ControlManifest.input.xml` file before building a new solution package if you intend to update an existing installation.

1.  **Create a Solution directory:** Create a subdirectory (e.g., `Solution`) within your main project folder.
    ```bash
    mkdir Solution
    cd Solution
    ```

2.  **Initialize the solution project:**
    ```bash
    pac solution init --publisher-name <YourPublisherName> --publisher-prefix <yourprefix>
    ```
    *   Replace `<YourPublisherName>` with the desired publisher name (e.g., `developer`).
    *   Replace `<yourprefix>` with the desired publisher prefix (e.g., `dev`). This prefix will be used for the solution components (e.g., `yourprefix_YourNamespace.YourControlName`).
    *   This creates a `src` subfolder and a `.cdsproj` file within the `Solution` directory.

3.  **Add a reference to your PCF control project:** Make sure you are still in the `Solution` directory. The path should point back to the directory containing the `.pcfproj` file.
    ```bash
    pac solution add-reference --path ..\
    ```
    *(Adjust `..\` if your PCF project directory is located elsewhere relative to the `Solution` directory).*

4.  **Build the Solution:** Run these commands from the `Solution` directory using the **Developer Command Prompt for Visual Studio** (or ensure MSBuild is in your PATH).

    *   **Build Unmanaged Solution:**
        ```bash
        msbuild /t:build /restore
        ```
        *This creates an unmanaged `solution.zip` file in the `Solution\bin\Debug` directory.*

    *   **Build Managed Solution:**
        ```bash
        msbuild /p:configuration=release
        ```
        *This creates a managed `solution.zip` file (optimized and smaller) in the `Solution\bin\Release` directory.*

---

## Deploy

### Authentication Profiles

Manage connections to your Dataverse/Power Apps environments.

1.  **Create a new authentication profile (if needed):**
    ```bash
    pac auth create --url <URL to Dynamics or Power Apps organization>
    ```
    *Example URL: `https://yourorg.crm.dynamics.com`*

2.  **List existing profiles:**
    ```bash
    pac auth list
    ```

3.  **Select the target environment:** Use the index number from the `pac auth list` output.
    ```bash
    pac auth select --index <index>
    ```

### Deployment Methods

#### Direct Push (for Development/Testing)

*   Push the *latest build* of your control directly to the currently selected environment.
*   Run this command from the **base control directory** (containing the `.pcfproj` file), **not** the `Solution` subfolder.
    ```bash
    pac pcf push --publisher-prefix <yourprefix>
    ```
    *Use the same publisher prefix (`<yourprefix>`) that you intend to use for your solutions.*

#### Solution Deployment

1.  **Increment Version:** Ensure you have incremented the version number in `ControlManifest.Input.xml` if updating an existing deployment.
2.  **Build Solution:** Build the managed (`/p:configuration=release`) or unmanaged (`/restore`) solution using MSBuild as described in the "Build and Package" section.
3.  **Import Solution:** Manually import the generated `solution.zip` file (from `Solution\bin\Debug` or `Solution\bin\Release`) into your target Dataverse/Power Apps environment via the Maker Portal (`make.powerapps.com`) or using other deployment tools/pipelines (like Power Platform Build Tools for Azure DevOps).

---

## Folder Structure Example

```
C:\PCF\MyControl\                   <-- Root folder you created manually
├── MyPCFControl\                   <-- Control folder (name from -n parameter)
│   ├── css\
│   ├── generated\
│   └── img\
│   ├── index.ts                    <-- Main control logic
│   └── ControlManifest.Input.xml   <-- Control definition
├── node_modules\                   <-- Created by 'npm install'
├── Solution\                       <-- Optional folder for solution packaging
│   ├── bin\
│   │   ├── Debug\
│   │   │   └── solution.zip        <-- Unmanaged Solution Output
│   │   └── Release\
│   │       └── solution.zip        <-- Managed Solution Output
│   ├── obj\
│   ├── src\
│   │   └── Other\
│   │       ├── Customizations.xml
│   │       ├── Relationships.xml
│   │       └── Solution.xml
│   └── Solution.cdsproj            <-- Solution Project File
├── .eslintrc.json
├── .gitignore
├── MyControl.pcfproj               <-- PCF Project File (name from root folder)
├── package-lock.json
├── package.json
└── tsconfig.json
```

---

## Troubleshooting

### Error: Cannot find module 'ajv/dist/compile/codegen'

This can sometimes occur due to dependency issues. Try running:

```bash
npm install --save-dev ajv
```

Then attempt your build (`npm run build`) again.

---

*This cheat sheet was adapted from content by Carl de Souza.*  
*Check out his YouTube channel for Power Platform tutorials: [Carl de Souza on YouTube](https://www.youtube.com/carldesouza)*
