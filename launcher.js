const statusEl = document.getElementById('status');

function updateStatus(msg, color = "#0f0") {
    statusEl.innerText = "STATUS: " + msg.toUpperCase();
    statusEl.style.color = color;
}

// Check if the engine loaded from the web
window.onload = () => {
    if (typeof V86Starter !== "undefined") {
        updateStatus("Ready. Select Android ISO.", "#0f0");
    } else {
        updateStatus("CDN Load Failed. Check Internet.", "#f00");
    }
};

document.getElementById('iso_input').onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    updateStatus("Booting " + file.name + "...");
    const reader = new FileReader();
    reader.onload = function(event) {
        try {
            new V86Starter({
                wasm_path: "https://copy.sh/v86/build/v86.wasm", // Load brain from CDN too
                memory_size: 512 * 1024 * 1024,
                vga_memory_size: 16 * 1024 * 1024,
                screen_container: document.getElementById("screen_container"),
                bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
                cdrom: { buffer: event.target.result },
                autostart: true,
            });
        } catch (err) {
            updateStatus("Error: " + err.message, "#f00");
        }
    };
    reader.readAsArrayBuffer(file);
};
