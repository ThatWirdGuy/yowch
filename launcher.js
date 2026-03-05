const dropZone = document.getElementById('drop-zone');
const screenContainer = document.getElementById('screen_container');

function startAndroid(apkBuffer) {
    // Hide UI and show the "Phone Screen"
    dropZone.style.display = 'none';
    screenContainer.style.display = 'block';

    const emulator = new V86Starter({
        wasm_path: "https://cdnjs.cloudflare.com/ajax/libs/v86/0.12.0/v86.wasm",
        memory_size: 512 * 1024 * 1024, // 512MB RAM
        vga_assets: "https://copy.sh/v86/bios/vgabios.bin",
        bios: { url: "https://copy.sh/v86/bios/seabios.bin" },
        // GET YOUR DIRECT LINK FROM SOURCEFORGE (Right-click "Problems Downloading")
        cdrom: { url: "REPLACE_WITH_YOUR_DIRECT_ISO_LINK" }, 
        autostart: true,
        screen_container: screenContainer,
    });

    emulator.add_listener("emulator-ready", function() {
        console.log("OS Booting... Injecting APK.");
        // This places the file into the virtual system's memory
        emulator.create_file("/game.apk", new Uint8Array(apkBuffer));
    });
}

// File Drop Logic
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
