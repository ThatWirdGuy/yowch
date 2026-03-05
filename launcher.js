/**
 * launcher.js - Final Stable Version
 */

function updateLoader(text, show = true) {
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader_text');
    const status = document.getElementById('status');

    if (loader) loader.style.display = show ? 'flex' : 'none';
    if (loaderText) loaderText.innerText = text.toUpperCase();
    if (status) status.innerText = text;
}

document.addEventListener("DOMContentLoaded", function() {
    const isoInput = document.getElementById('iso_input');

    if (isoInput) {
        isoInput.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;

            // Start Loading Screen
            updateLoader("Reading ISO: " + file.name + "...", true);

            const reader = new FileReader();
            reader.onload = function(event) {
                const isoBuffer = event.target.result;
                updateLoader("ISO Loaded. Checking V86 Library...", true);
                
                // Final check for the engine before booting
                if (typeof V86Starter === "undefined") {
                    updateLoader("", false);
                    alert("FATAL ERROR: libv86.js failed to load. Please refresh and check your internet.");
                    return;
                }

                startAndroid(isoBuffer);
            };

            reader.readAsArrayBuffer(file);
        };
    }
});

function startAndroid(isoBuffer) {
    updateLoader("Booting Android VM...", true);

    const emulator = new V86Starter({
        wasm_path: "https://copy.sh/v86/build/v86.wasm",
        memory_size: 1024 * 1024 * 1024, // 1GB RAM for Android 9.0
        vga_memory_size: 16 * 1024 * 1024,
        screen_container: document.getElementById("screen_container"),
        bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
        cdrom: { buffer: isoBuffer },
        autostart: true,
    });

    // When the VM actually starts the CPU, hide the loader
    emulator.add_listener("emulator-started", function() {
        console.log("CPU Started successfully.");
        updateLoader("System Running", false);
        
        // Call the reporter function if it exists
        if (typeof reportStatus === "function") {
            reportStatus("Android Emulation Initialized.");
        }
    });
}
