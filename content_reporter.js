/**
 * content_reporter.js
 * Fixed for Browser Extension/Opera GX Environments
 */

// We use global function declaration instead of 'export' 
// so launcher.js can access it directly.
function reportStatus(message) {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] Reporter: ${message}`);
}

// Log that the script is alive
console.log("Content Reporter Loaded Successfully (No Exports).");
