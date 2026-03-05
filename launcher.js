const dropZone = document.getElementById('drop-zone');
const screenContainer = document.getElementById('screen_container');

function startAndroid(apkBuffer) {
    // Hide the drop zone and show the emulator screen
    dropZone.style.display = 'none';
    screenContainer.style.display = 'block';

    // Initialize the v86 Emulator
    const emulator = new V86Starter({
        wasm_path: "https://cdnjs.cloudflare.com/ajax/libs/v86/0.12.0/v86.wasm",
        memory_size: 512 * 1024 * 1024, // 512MB RAM
        vga_assets: "https://copy.sh/v86/bios/vgabios.bin",
        bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
        // REPLACE THIS URL with a direct link to your Android-x86 ISO
        cdrom: { url: "https://your-direct-link-to-android.iso" }, 
        autostart: true,
        screen_container: screenContainer,
    });

    emulator.add_listener("emulator-ready", function() {
        console.log("Virtual Machine Ready.");
        // Inject the APK into the VM's memory
        emulator.create_file("/game.apk", new Uint8Array(apkBuffer));
    });
}

// Drag & Drop Listeners
dropZone.ondragover = e => e.preventDefault();
dropZone.ondrop = e => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith('.apk')) {
        const reader = new FileReader();
        reader.onload = (ev) => startAndroid(ev.target.result);
        reader.readAsArrayBuffer(file);
    } else {
        alert("Please drop a valid .apk file!");
    }
};
