const { execSync } = require('child_process');

const args = process.argv.slice(2);
let payload = {};

try {
    payload = JSON.parse(args[0] || '{}');
} catch (e) {
    console.log(JSON.stringify({ success: false, error: 'Invalid JSON payload' }));
    process.exit(1);
}

const { action, x = 0, y = 0, button = 'left' } = payload;

try {
    if (action === 'move') {
        // Windows PowerShell se physical mouse move
        const psCommand = `Add-Type -AssemblyName System.Windows.Forms; [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${Math.round(x)}, ${Math.round(y)})`;
        execSync(`powershell -NoProfile -ExecutionPolicy Bypass -Command "${psCommand}"`);
        console.log(JSON.stringify({ success: true, message: `Moved cursor to (${x}, ${y})` }));
    }
    else if (action === 'click') {
        // Windows User32 API + PowerShell se physical mouse click
        const clickFlagDown = button === 'right' ? '0x08' : '0x02';
        const clickFlagUp = button === 'right' ? '0x10' : '0x04';

        const psCommand = `
      $type = Add-Type -memberDefinition '[DllImport("user32.dll")] public static extern void mouse_event(int dwFlags, int dx, int dy, int cButtons, int dwExtraInfo);' -name "Win32Mouse" -namespace Win32 -passThru;
      Add-Type -AssemblyName System.Windows.Forms;
      [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point(${Math.round(x)}, ${Math.round(y)});
      $type::mouse_event(${clickFlagDown}, 0, 0, 0, 0);
      $type::mouse_event(${clickFlagUp}, 0, 0, 0, 0);
    `.replace(/\n/g, ' ');

        execSync(`powershell -NoProfile -ExecutionPolicy Bypass -Command "${psCommand}"`);
        console.log(JSON.stringify({ success: true, message: `Clicked at (${x}, ${y})` }));
    }
    else {
        console.log(JSON.stringify({ success: false, error: `Action '${action}' not supported` }));
    }
} catch (err) {
    console.log(JSON.stringify({ success: false, error: err.message }));
}