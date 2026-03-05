function updateUI(text, showLoader = false) {
    const status = document.getElementById('status');
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader_text');
    if (status) status.innerText = text;
    if (loader) loader.style.display = showLoader ? 'flex' : 'none';
    if (loaderText) loaderText.innerText = text.toUpperCase();
}

document.addEventListener("DOMContentLoaded", function() {
    const isoInput = document.getElementById('iso_input');
    if (isoInput) {
        isoInput.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;

            updateUI("Reading ISO: " + file.name, true);

            const reader = new FileReader();
            reader.onload = function(event) {
                // Verify the engine loaded from your Vercel files
                if (typeof V86Starter === "undefined") {
                    updateUI("FATAL: libv86.js missing from project folder!", false);
                    return;
                }
                startAndroid(event.target.result);
            };
            reader.readAsArrayBuffer(file);
        };
    }
});

function startAndroid(isoBuffer) {
    updateUI("Booting Android Engine...", true);

    const emulator = new V86Starter({
        wasm_path: "v86.wasm", // Looks for the file in your Vercel repo
        memory_size: 1024 * 1024 * 1024,
        vga_memory_size: 16 * 1024 * 1024,
        screen_container: document.getElementById("screen_container"),
        bios: { url: "https://copy.sh/v86/bios/seabios.bin" }, 
        cdrom: { buffer: isoBuffer },
        autostart: true,
    });

    emulator.add_listener("emulator-started", function() {
        updateUI("System Running", false);
    });
}
