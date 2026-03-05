// 1. DELETE any 'import' lines at the top of this file

document.addEventListener("DOMContentLoaded", function() {
    // 2. Wrap your input logic here
    const isoInput = document.getElementById('iso_input');

    if (isoInput) {
        isoInput.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function(event) {
                // reportStatus is now global, so we can just call it
                reportStatus("ISO Loaded. Starting emulator...");
                startAndroid(event.target.result);
            };
            reader.readAsArrayBuffer(file);
        };
    }
});

function startAndroid(isoBuffer) {
    // Your V86Starter code goes here (make sure screen_container exists in HTML)
    const emulator = new V86Starter({
        wasm_path: "https://copy.sh/v86/build/v86.wasm",
        memory_size: 512 * 1024 * 1024,
        screen_container: document.getElementById("screen_container"),
        bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
        cdrom: { buffer: isoBuffer },
        autostart: true,
    });
}
