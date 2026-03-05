const dropZone = document.getElementById('drop-zone');
const screenContainer = document.getElementById('screen_container');

// This function runs when you drop the file
function startEmulator(apkBuffer) {
    dropZone.style.display = 'none';
    screenContainer.style.display = 'block';

    const emulator = new V86Starter({
        wasm_path: "https://cdnjs.cloudflare.com/ajax/libs/v86/0.12.0/v86.wasm",
        memory_size: 512 * 1024 * 1024,
        vga_assets: "https://copy.sh/v86/bios/vgabios.bin",
        bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
        // IMPORTANT: Replace this with your Android-x86 ISO link from SourceForge
        cdrom: { url: "https://your-direct-link-to-android.iso" }, 
        autostart: true,
        screen_container: screenContainer,
    });

    emulator.add_listener("emulator-ready", function() {
        console.log("Android is booting...");
        // This puts your APK into the virtual machine's memory
        emulator.create_file("/game.apk", new Uint8Array(apkBuffer));
    });
}

// Drag and Drop Logic
dropZone.ondragover = e => e.preventDefault();
dropZone.ondrop = e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.apk')) {
        const reader = new FileReader();
        reader.onload = (ev) => startEmulator(ev.target.result);
        reader.readAsArrayBuffer(file);
    } else {
        alert("Please drop a valid .apk file");
    }
};
