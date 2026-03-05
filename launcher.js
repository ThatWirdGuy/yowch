/**
 * launcher.js - Final Stable Version
 */

function updateLoader(text, show = true) {
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader_text');
    if (loader) loader.style.display = show ? 'flex' : 'none';
    if (loaderText) loaderText.innerText = text.toUpperCase();
}

document.addEventListener("DOMContentLoaded", function() {
    const isoInput = document.getElementById('iso_input');

    if (isoInput) {
        isoInput.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;

            updateLoader("Reading ISO File...", true);

            const reader = new FileReader();
            reader.onload = function(event) {
                // Check if the library is ready
                if (typeof V86Starter === "undefined") {
                    updateLoader("", false);
                    alert("FATAL: The v86 engine is blocked. Try turning off Opera VPN or using a local server.");
                    return;
                }
                startAndroid(event.target.result);
            };
            reader.readAsArrayBuffer(file);
        };
    }
});

function startAndroid(isoBuffer) {
    updateLoader("Booting Android...", true);

    const emulator = new V86Starter({
        // Link to the online brain
        wasm_path: "https://unpkg.com/v86@latest/build/v86.wasm",
        memory_size: 1024 * 1024 * 1024,
        vga_memory_size: 16 * 1024 * 1024,
        screen_container: document.getElementById("screen_container"),
        bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
        cdrom: { buffer: isoBuffer },
        autostart: true,
    });

    emulator.add_listener("emulator-started", function() {
        updateLoader("", false);
        if (typeof reportStatus === "function") reportStatus("Android System Started");
    });
}
