function updateUI(text, showLoader = false) {
    const status = document.getElementById('status');
    const loader = document.getElementById('loader');
    if (status) status.innerText = text;
    if (loader) loader.style.display = showLoader ? 'flex' : 'none';
}

document.getElementById('iso_input').onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    updateUI("Reading ISO...", true);

    const reader = new FileReader();
    reader.onload = function(event) {
        // Retry logic: Wait up to 1 second for the library to be ready
        let attempts = 0;
        const checkLibrary = setInterval(() => {
            if (typeof V86Starter !== "undefined") {
                clearInterval(checkLibrary);
                startEmulator(event.target.result);
            } else {
                attempts++;
                if (attempts > 10) {
                    clearInterval(checkLibrary);
                    updateUI("FATAL: libv86.js failed to initialize!", false);
                }
            }
        }, 100);
    };
    reader.readAsArrayBuffer(file);
};

function startEmulator(isoBuffer) {
    updateUI("Starting VM...", true);
    
    const emulator = new V86Starter({
        wasm_path: "./v86.wasm",
        memory_size: 1024 * 1024 * 1024,
        vga_memory_size: 16 * 1024 * 1024,
        screen_container: document.getElementById("screen_container"),
        bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
        cdrom: { buffer: isoBuffer },
        autostart: true,
    });

    emulator.add_listener("emulator-started", () => {
        updateUI("Running", false);
    });
}
