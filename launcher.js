// Ensure we handle the "Unexpected token export" by using a module-friendly approach
import { someReporter } from './content_reporter.js'; 

function startAndroid(isoBuffer) {
    // Check if the library loaded correctly
    if (typeof V86Starter === "undefined") {
        console.error("V86Starter is not defined. Check if libv86.js is loaded.");
        return;
    }

    const emulator = new V86Starter({
        wasm_path: "https://copy.sh/v86/build/v86.wasm",
        memory_size: 512 * 1024 * 1024, // Android needs at least 512MB
        vga_memory_size: 8 * 1024 * 1024,
        screen_container: document.getElementById("screen_container"),
        bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
        cdrom: { buffer: isoBuffer }, // Using the buffer from your file reader
        autostart: true,
    });
}

// Fixed listener for your file upload
const reader = new FileReader();
reader.onload = function(e) {
    const buffer = e.target.result;
    startAndroid(buffer);
};

// Assuming you have an <input type="file" id="iso_input">
document.getElementById('iso_input').onchange = function(e) {
    reader.readAsArrayBuffer(this.files[0]);
};
