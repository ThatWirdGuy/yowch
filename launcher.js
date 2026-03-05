function updateUI(text, showLoader = false) {
    const status = document.getElementById('status');
    const loader = document.getElementById('loader');
    if (status) status.innerText = text.toUpperCase();
    if (loader) loader.style.display = showLoader ? 'flex' : 'none';
}

document.getElementById('iso_input').onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;

    updateUI("Reading " + file.name, true);

    const reader = new FileReader();
    reader.onload = function(event) {
        // Double check that libv86.js actually provided the V86Starter object
        if (typeof V86Starter === "undefined") {
            updateUI("FATAL: V86Starter object not found in memory!", false);
            alert("Error: libv86.js failed to initialize. Check browser console (F12).");
            return;
        }

        const emulator = new V86Starter({
            wasm_path: "./v86.wasm", // Points to the 'brain' file in your repo
            memory_size: 1024 * 1024 * 1024, // 1GB RAM
            vga_memory_size: 16 * 1024 * 1024,
            screen_container: document.getElementById("screen_container"),
            bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
            cdrom: { buffer: event.target.result },
            autostart: true,
        });

        emulator.add_listener("emulator-started", function() {
            updateUI("Running", false);
        });
    };
    reader.readAsArrayBuffer(file);
};
