const statusEl = document.getElementById('status');

function updateStatus(msg, color = "#0f0") {
    statusEl.innerText = "STATUS: " + msg.toUpperCase();
    statusEl.style.color = color;
}

// The "Watcher" loop: Checks every 500ms for the engine
function waitForV86() {
    if (typeof V86Starter !== "undefined") {
        if (window.crossOriginIsolated) {
            updateStatus("Ready. Select Android ISO.", "#0f0");
        } else {
            updateStatus("Security Locked. Please refresh the page.", "#ff9800");
        }
    } else {
        updateStatus("Loading libv86.js into memory...", "#ff9800");
        setTimeout(waitForV86, 500);
    }
}

waitForV86();

document.getElementById('iso_input').onchange = function(e) {
    const file = e.target.files[0];
    if (!file || typeof V86Starter === "undefined") return;

    updateStatus("Reading ISO: " + file.name);
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            const emulator = new V86Starter({
                wasm_path: "./v86.wasm",
                memory_size: 512 * 1024 * 1024,
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
