const statusEl = document.getElementById('status');

function updateStatus(msg, color = "#0f0") {
    statusEl.innerText = "STATUS: " + msg.toUpperCase();
    statusEl.style.color = color;
}

// LIVE WATCHER: Keep checking until V86Starter exists
const checkEngine = setInterval(() => {
    if (typeof V86Starter !== "undefined") {
        clearInterval(checkEngine);
        if (window.crossOriginIsolated) {
            updateStatus("READY. SELECT ANDROID ISO.", "#0f0");
        } else {
            updateStatus("SECURITY ACTIVE. PLEASE REFRESH ONCE.", "#ff9800");
        }
    } else {
        updateStatus("SEARCHING FOR V86 ENGINE...", "#ff9800");
    }
}, 500);

document.getElementById('iso_input').onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (typeof V86Starter === "undefined") {
        alert("Wait! The engine hasn't loaded yet. Check your internet connection.");
        return;
    }

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

            emulator.add_listener("emulator-started", () => updateStatus("ANDROID BOOTING..."));
        } catch (err) {
            updateStatus("BOOT ERROR: " + err.message, "#f00");
        }
    };
    reader.readAsArrayBuffer(file);
};
