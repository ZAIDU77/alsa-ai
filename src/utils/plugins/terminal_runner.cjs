// src/utils/plugins/terminal_runner.cjs
const { exec } = require('child_process');

function executeTerminalCommand(command, cwd = process.cwd()) {
    return new Promise((resolve) => {
        exec(command, { cwd, shell: true }, (error, stdout, stderr) => {
            if (error) {
                resolve({ success: false, error: stderr || error.message });
            } else {
                resolve({ success: true, output: stdout.trim() });
            }
        });
    });
}

module.exports = { executeTerminalCommand };

if (require.main === module) {
    const cmd = process.argv[2] || 'dir';
    executeTerminalCommand(cmd).then((res) => console.log(JSON.stringify(res)));
}