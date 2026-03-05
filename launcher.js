const statusEl = document.getElementById('status');

function updateStatus(msg, color = "#0f0") {
    statusEl.innerText = "STATUS: " + msg.toUpperCase();
    statusEl.style.color = color;
}

window.onload = () => {
    // Check if the Service Worker successfully unlocked SharedArrayBuffer
    if (!window.crossOriginIsolated) {
        updateStatus("Security Restricted. Refreshing to unlock engine...", "#ff9800");
    } else if (typeof V86Starter !== "undefined") {
        updateStatus("Ready. Select Android ISO.", "#0f0");
    } else {
        updateStatus("libv86.js not found in memory.", "#f00");
    }
};

document.getElementById('iso_input').onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (!window.crossOriginIsolated) {
        alert("The browser is still blocking the engine. Please refresh the page.");
        return;
    }

    updateStatus("Reading ISO...");
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

            emulator.add_listener("emulator-started", () => updateStatus("Android Running"));
        } catch (err) {
            updateStatus("Error: " + err.message, "#f00");
        }
    };
    reader.readAsArrayBuffer(file);
};
