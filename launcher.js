const dropZone = document.getElementById('drop-zone');
const screenContainer = document.getElementById('screen_container');

function startAndroid(apkBuffer) {
    dropZone.style.display = 'none';
    screenContainer.style.display = 'block';

    const emulator = new V86Starter({
        wasm_path: "https://copy.sh/v86/build/v86.wasm",
        memory_size: 512 * 1024 * 1024,
        vga_assets: "https://copy.sh/v86/bios/vgabios.bin",
        bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
        // IMPORTANT: SourceForge links often block automated downloads.
        // Try using a direct archive link like this one:
        cdrom: { url: "https://archive.org/download/android-x-86-4.4-r-5/android-x86-4.4-r5.iso" }, 
        autostart: true,
        screen_container: screenContainer,
    });

    emulator.add_listener("emulator-ready", function() {
        console.log("System Ready. Uploading Game...");
        emulator.create_file("/game.apk", new Uint8Array(apkBuffer));
    });
}

// Drag and Drop Logic
dropZone.ondragover = e => e.preventDefault();
dropZone.ondrop = e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    const reader = new FileReader();
    reader.onload = (ev) => startAndroid(ev.target.result);
    reader.readAsArrayBuffer(file);
};
