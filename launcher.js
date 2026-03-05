const statusEl = document.getElementById('status');

function updateStatus(msg, color = "#ff9800") {
    statusEl.innerText = "STATUS: " + msg.toUpperCase();
    statusEl.style.color = color;
}

// Watch for the engine to appear in browser memory
const checkEngine = setInterval(() => {
    if (typeof V86Starter !== "undefined") {
        clearInterval(checkEngine);
        if (window.crossOriginIsolated) {
            updateStatus("Ready. Select Android ISO.", "#0f0");
        } else {
            updateStatus("Security Locked. Click 'Force Unlock' button.", "#ff9800");
        }
    } else {
        updateStatus("Downloading Engine from Web...", "#ff9800");
    }
}, 1000);

document.getElementById('iso_input').onchange = function(e) {
    const file = e.target.files[0];
    if (!file || typeof V86Starter === "undefined") return;

    updateStatus("Reading ISO: " + file.name);
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            new V86Starter({
                // Load the 'brain' from the web too
                wasm_path: "https://copy.sh/v86/build/v86.wasm",
                memory_size: 512 * 1024 * 1024,
                vga_memory_size: 16 * 1024 * 1024,
                screen_container: document.getElementById("screen_container"),
                bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
                cdrom: { buffer: event.target.result },
                autostart: true,
            });
            updateStatus("Android Running", "#0f0");
        } catch (err) {
            updateStatus("Boot Error: " + err.message, "#f00");
        }
    };
    reader.readAsArrayBuffer(file);
};
