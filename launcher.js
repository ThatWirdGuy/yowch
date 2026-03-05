const statusEl = document.getElementById('status');

function updateStatus(msg, color = "#0f0") {
    statusEl.innerText = msg.toUpperCase();
    statusEl.style.color = color;
}

// Security Check
window.onload = () => {
    if (!window.crossOriginIsolated) {
        updateStatus("Security: Restricted. Refreshing to unlock...", "#ff9800");
    } else if (typeof V86Starter !== "undefined") {
        updateStatus("Ready. Select ISO.", "#0f0");
    } else {
        updateStatus("Engine missing in folder.", "#f00");
    }
};

document.getElementById('iso_input').onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    updateStatus("Reading " + file.name);
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const emulator = new V86Starter({
                wasm_path: "./v86.wasm",
                memory_size: 512 * 1024 * 1024, // 512MB for stability
                vga_memory_size: 16 * 1024 * 1024,
                screen_container: document.getElementById("screen_container"),
                bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
                cdrom: { buffer: event.target.result },
                autostart: true,
            });

            emulator.add_listener("emulator-started", () => updateStatus("Running"));
        } catch (err) {
            updateStatus("Error: " + err.message, "#f00");
        }
    };
    reader.readAsArrayBuffer(file);
};
