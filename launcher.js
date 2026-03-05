function updateLoader(text, show = true) {
    const loader = document.getElementById('loader');
    const loaderText = document.getElementById('loader_text');
    if (loader) loader.style.display = show ? 'flex' : 'none';
    if (loaderText) loaderText.innerText = text.toUpperCase();
}

document.addEventListener("DOMContentLoaded", function() {
    const isoInput = document.getElementById('iso_input');
    if (isoInput) {
        isoInput.onchange = function(e) {
            const file = e.target.files[0];
            if (!file) return;
            updateLoader("Reading ISO...", true);
            const reader = new FileReader();
            reader.onload = function(event) {
                startAndroid(event.target.result);
            };
            reader.readAsArrayBuffer(file);
        };
    }
});

function startAndroid(isoBuffer) {
    if (typeof V86Starter === "undefined") {
        updateLoader("", false);
        alert("FATAL: libv86.js is still not loading. Ensure the file is in your folder!");
        return;
    }

    const emulator = new V86Starter({
        // POINTING TO LOCAL WASM NOW
        wasm_path: "v86.wasm",
        memory_size: 1024 * 1024 * 1024,
        vga_memory_size: 16 * 1024 * 1024,
        screen_container: document.getElementById("screen_container"),
        bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
        cdrom: { buffer: isoBuffer },
        autostart: true,
    });

    emulator.add_listener("emulator-started", function() {
        updateLoader("", false);
    });
}
