/**
 * launcher.js - Android x86 Emulator Logic
 * Designed for Opera GX / Browser Environments
 */

// We use a listener to make sure the HTML is finished drawing 
// before we try to find the 'iso_input' or 'screen_container'.
document.addEventListener("DOMContentLoaded", function() {
    
    const isoInput = document.getElementById('iso_input');
    const statusDisplay = document.getElementById('status');

    // Prevent "Cannot set properties of null" error
    if (!isoInput) {
        console.error("Error: Could not find 'iso_input' in the HTML.");
        return;
    }

    // This triggers when you select the Android ISO from SourceForge
    isoInput.onchange = function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (statusDisplay) statusDisplay.innerText = "Reading ISO file... (this may take a moment)";

        const reader = new FileReader();
        
        reader.onload = function(event) {
            const isoBuffer = event.target.result;
            
            if (statusDisplay) statusDisplay.innerText = "ISO Loaded. Booting Virtual Machine...";
            
            // Call the boot function with the file data
            startAndroid(isoBuffer);
        };

        // Start reading the large file
        reader.readAsArrayBuffer(file);
    };
});

/**
 * The main function that starts the v86 Emulator
 */
function startAndroid(isoBuffer) {
    // Check if the v86 library (libv86.js) was loaded correctly
    if (typeof V86Starter === "undefined") {
        alert("Error: libv86.js failed to load. Check your internet or script tags.");
        return;
    }

    const emulator = new V86Starter({
        // Link to the WebAssembly "brain" of the emulator
        wasm_path: "https://copy.sh/v86/build/v86.wasm",
        
        // Memory settings for Android 9.0 (1GB is recommended)
        memory_size: 1024 * 1024 * 1024, 
        vga_memory_size: 16 * 1024 * 1024,
        
        // Tell the emulator which HTML box to draw the video in
        screen_container: document.getElementById("screen_container"),
        
        // Standard BIOS for x86 booting
        bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
        
        // Load the ISO we just picked
        cdrom: { buffer: isoBuffer },
        
        autostart: true,
    });

    console.log("Android x86 Emulator Started.");
}
