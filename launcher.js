const statusEl = document.getElementById('status');
const loaderEl = document.getElementById('loader');

function updateStatus(msg, loading = false) {
    if (statusEl) statusEl.innerText = msg.toUpperCase();
    if (loaderEl) loaderEl.style.display = loading ? 'flex' : 'none';
}

document.getElementById('iso_input').onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    updateStatus("Reading ISO...", true);

    const reader = new FileReader();
    reader.onload = function(event) {
        let retries = 0;
        const maxRetries = 20; // 2 seconds total

        const waitForEngine = setInterval(() => {
            if (typeof V86Starter !== "undefined") {
                clearInterval(waitForEngine);
                bootVM(event.target.result);
            } else {
                retries++;
                updateStatus(`Initializing Engine (Attempt ${retries})...`, true);
                if (retries >= maxRetries) {
                    clearInterval(waitForEngine);
                    updateStatus("FATAL: Engine initialization timed out!", false);
                }
            }
        }, 100);
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
            updateStatus("System Running", false);
        });
    } catch (err) {
        updateStatus("Boot Error: " + err.message, false);
    }
}
