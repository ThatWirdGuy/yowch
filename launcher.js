function updateUI(text, showLoader = false) {
    const status = document.getElementById('status');
    const loader = document.getElementById('loader');
    if (status) status.innerText = text;
    if (loader) loader.style.display = showLoader ? 'flex' : 'none';
}

// Pre-flight Check
window.onload = function() {
    if (typeof V86Starter === "undefined") {
        updateUI("ERROR: Engine failed to initialize. Check Console (F12).");
    }
};

document.getElementById('iso_input').onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    updateUI("Reading " + file.name + "...", true);

    const reader = new FileReader();
    reader.onload = function(event) {
        if (typeof V86Starter === "undefined") {
            updateUI("FATAL: V86Starter is missing!", false);
            return;
        }
        
        const emulator = new V86Starter({
            wasm_path: "v86.wasm",
            memory_size: 1024 * 1024 * 1024,
            vga_memory_size: 16 * 1024 * 1024,
            screen_container: document.getElementById("screen_container"),
            bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
            cdrom: { buffer: event.target.result },
            autostart: true,
        });

        emulator.add_listener("emulator-started", () => updateUI("Running", false));
    };
    reader.readAsArrayBuffer(file);
};
