const pty = require("node-pty");
const os = require("os");

// Default shell selection (Windows ke liye PowerShell)
const shell = os.platform() === "win32" ? "powershell.exe" : "bash";

class TerminalController {
    constructor() {
        this.ptyProcess = null;
    }

    // Interactive Terminal Session Initialize karna
    initTerminal(onDataCallback) {
        this.ptyProcess = pty.spawn(shell, [], {
            name: "xterm-color",
            cols: 80,
            rows: 30,
            cwd: process.cwd(),
            env: process.env
        });

        // Real-time output stream listener
        this.ptyProcess.onData((data) => {
            if (onDataCallback) {
                onDataCallback(data);
            } else {
                process.stdout.write(data);
            }
        });

        console.log(`⚡ Native Terminal Session Started (${shell})`);
    }

    // Terminal mein Command Execute karna
    sendCommand(command) {
        if (!this.ptyProcess) {
            console.error("❌ Terminal session initialized nahi hai!");
            return;
        }
        // Send command with newline (Enter press emulation)
        this.ptyProcess.write(`${command}\r`);
    }

    // Terminal Resize Handler
    resize(cols, rows) {
        if (this.ptyProcess) {
            this.ptyProcess.resize(cols, rows);
        }
    }

    // Terminal Session Kill/Close karna
    close() {
        if (this.ptyProcess) {
            this.ptyProcess.kill();
            console.log("🛑 Terminal Session Closed.");
        }
    }
}

// Direct Execution / Testing Logic
if (require.main === module) {
    const terminal = new TerminalController();

    // Live Output Callback
    terminal.initTerminal((data) => {
        process.stdout.write(data);
    });

    // Test Sequence: Run basic commands
    setTimeout(() => {
        console.log("\n🚀 Executing Test Command: Get-Location...");
        terminal.sendCommand("Get-Location");
    }, 1500);

    setTimeout(() => {
        console.log("\n🚀 Executing Test Command: dir...");
        terminal.sendCommand("dir");
    }, 3500);

    // Cleanup after 7 seconds
    setTimeout(() => {
        terminal.close();
        process.exit(0);
    }, 7000);
}

module.exports = TerminalController;