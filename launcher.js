const statusEl = document.getElementById('status');
const loaderEl = document.getElementById('loader');

function updateStatus(msg, loading = false, color = "#4caf50") {
    if (statusEl) {
        statusEl.innerText = msg.toUpperCase();
        statusEl.style.color = color;
    }
    if (loaderEl) loaderEl.style.display = loading ? 'flex' : 'none';
}

// Check on page load
window.addEventListener('load', () => {
    if (typeof V86Starter !== "undefined") {
        updateStatus("READY", false, "#4caf50");
    } else {
        updateStatus("ENGINE NOT LOADED - ATTEMPTING RECOVERY", false, "#ff9800");
    }
});

document.getElementById('iso_input').onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (typeof V86Starter === "undefined") {
        updateStatus("FATAL: ENGINE BLOCKED BY BROWSER", false, "#ff3333");
        return;
    }

    updateStatus("Reading ISO...", true);
    const reader = new FileReader();
    reader.onload = function(event) {
        bootVM(event.target.result);
    };
    reader.readAsArrayBuffer(file);
};

function bootVM(isoBuffer) {
    updateStatus("Booting Android...", true);
    try {
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
            updateStatus("System Running", false, "#4caf50");
        });
    } catch (err) {
        updateStatus("Boot Error: " + err.message, false, "#ff3333");
    }
}
