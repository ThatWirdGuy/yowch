const statusEl = document.getElementById('status');

function updateStatus(msg, color = "#0f0") {
    statusEl.innerText = "STATUS: " + msg.toUpperCase();
    statusEl.style.color = color;
}

// Check every 500ms
const checkInit = setInterval(() => {
    if (typeof V86Starter !== "undefined") {
        clearInterval(checkInit);
        if (window.crossOriginIsolated) {
            updateStatus("Ready. Select ISO.", "#0f0");
        } else {
            updateStatus("Security Locked. Refresh the page once.", "#ff9800");
        }
    } else {
        // This tells us if the file is even reaching the browser
        const scripts = Array.from(document.scripts).map(s => s.src);
        console.log("Loaded scripts:", scripts);
        updateStatus("Searching for V86Starter in memory...", "#ff9800");
    }
}, 500);

document.getElementById('iso_input').onchange = function(e) {
    const file = e.target.files[0];
    if (!file || typeof V86Starter === "undefined") return;

    const reader = new FileReader();
    reader.onload = function(event) {
        new V86Starter({
            wasm_path: "./v86.wasm",
            memory_size: 512 * 1024 * 1024,
            vga_memory_size: 16 * 1024 * 1024,
            screen_container: document.getElementById("screen_container"),
            bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
            cdrom: { buffer: event.target.result },
            autostart: true,
        });
    };
    reader.readAsArrayBuffer(file);
};
