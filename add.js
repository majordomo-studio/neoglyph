#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

// ShadCN components required for each component
const shadcnComponents = {
  datagrid: [
    "table",
    "badge",
    "button",
    "input",
    "select",
    "dropdown-menu",
    "alert-dialog",
    "switch",
    "calendar",
    "popover",
    "tooltip",
  ],
  datagridfacetedfilter: [
    "command",
    "popover",
    "badge",
    "separator",
    "button",
  ],
  databricks: [
    "card",
    "badge",
    "button",
    "input",
    "tooltip",
    "alert-dialog",
    "table",
  ],
  databricksfacetedfilter: [
    "command",
    "popover",
    "badge",
    "button",
  ],
};

// NPM dependencies for the components
const npmDependencies = [
  "@tanstack/react-table",
  "lucide-react",
  "zod",
  "date-fns",
  "framer-motion",
];

// File mappings for the components
const componentFiles = {
  datagrid: ["DataGrid.js", "DataGridFacetedFilter.js"],
  databricks: ["DataBricks.js", "DataBricksFacetedFilter.js"],
};

// Helper: Run a shell command
function runCommand(command) {
  try {
    execSync(command, { stdio: "inherit" });
  } catch (error) {
    console.error(`Error executing command: ${command}`);
    process.exit(1);
  }
}

// Helper: Ensure 'ui' folder exists
function ensureUIFolder() {
  const uiFolderPath = path.resolve(process.cwd(), "ui");
  if (!fs.existsSync(uiFolderPath)) {
    fs.mkdirSync(uiFolderPath, { recursive: true });
    console.log("Created 'ui' folder.");
  }
  return uiFolderPath;
}

// Helper: Copy component files
function copyComponentFiles(uiFolderPath, componentName) {
  const filesToCopy = componentFiles[componentName];
  if (!filesToCopy) {
    console.error(`Unknown component: ${componentName}`);
    process.exit(1);
  }

  filesToCopy.forEach((file) => {
    const sourcePath = path.resolve(__dirname, "components", file);
    const destPath = path.resolve(uiFolderPath, file);

    if (!fs.existsSync(sourcePath)) {
      console.error(`File not found: ${sourcePath}`);
      process.exit(1);
    }

    fs.copyFileSync(sourcePath, destPath);
    console.log(`Copied ${file} to 'ui/${file}'.`);
  });
}

// Main installation logic
function installComponent(componentName) {
  console.log(`Installing required ShadCN components for '${componentName}'...`);

  const components = shadcnComponents[componentName];
  if (!components) {
    console.error(`Unknown component: ${componentName}`);
    process.exit(1);
  }

  components.forEach((shadcnComponent) => {
    console.log(`Adding ShadCN component: ${shadcnComponent}`);
    runCommand(`npx shadcn@latest add ${shadcnComponent}`);
  });

  console.log(`Installing additional npm dependencies...`);
  runCommand(`npm install ${npmDependencies.join(" ")}`);

  console.log(`Setting up your custom ${componentName} component...`);
  const uiFolderPath = ensureUIFolder();
  copyComponentFiles(uiFolderPath, componentName);

  console.log(`Installation of '${componentName}' is complete! Your components are ready to use.`);
}

// Parse user input
function main() {
  const args = process.argv.slice(2);
  const componentName = args[0]?.toLowerCase();

  if (!componentName || !Object.keys(componentFiles).includes(componentName)) {
    console.error(
      "Usage: npx majordomo.studio/neoglyph@latest add <component>\nAvailable components: datagrid, databricks"
    );
    process.exit(1);
  }

  installComponent(componentName);
}

main();
