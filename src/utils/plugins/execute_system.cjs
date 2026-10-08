// src/utils/plugins/execute_system.cjs
const { exec, execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ALLOWED_CMD_PREFIXES = [
    'dir', 'cd', 'type', 'echo', 'cls', 'ver', 'date', 'time',
    'whoami', 'hostname', 'ipconfig', 'ping', 'netstat',
    'systeminfo', 'tasklist', 'tree', 'where', 'set',
    'python --version', 'node --version', 'npm --version',
    'git --version', 'java --version'
];

function sanitize(input) {
    return String(input || '').replace(/[;&|`$\n\r]/g, '');
}

async function executeCmd(command) {
    const cleanCmd = sanitize(command).trim();
    const isAllowed = ALLOWED_CMD_PREFIXES.some(prefix => cleanCmd.toLowerCase().startsWith(prefix));

    if (!isAllowed) {
        return { success: false, error: 'Command not in whitelist' };
    }

    try {
        const stdout = execSync(cleanCmd, { encoding: 'utf-8', timeout: 30000 });
        return { success: true, stdout, stderr: '', returncode: 0 };
    } catch (err) {
        return { success: false, stdout: err.stdout || '', stderr: err.message, returncode: err.status || 1 };
    }
}

async function executePython(filePath) {
    const cleanPath = sanitize(filePath);
    if (!fs.existsSync(cleanPath) || !cleanPath.endsWith('.py')) {
        return { success: false, error: 'Invalid or non-existent Python file' };
    }

    try {
        const stdout = execSync(`python "${cleanPath}"`, { encoding: 'utf-8', timeout: 30000 });
        return { success: true, stdout, stderr: '' };
    } catch (err) {
        return { success: false, error: err.message, stderr: err.stderr || '' };
    }
}

function createProject({ project_path, files }) {
    const cleanPath = sanitize(project_path);
    if (!cleanPath) return { success: false, error: 'No project path provided' };

    fs.mkdirSync(cleanPath, { recursive: true });
    const created = [];

    for (const [filename, content] of Object.entries(files || {})) {
        const safeName = path.normalize(filename).replace(/^(\.\.[\/\\])+/, '');
        const fullPath = path.join(cleanPath, safeName);

        fs.mkdirSync(path.dirname(fullPath), { recursive: true });
        fs.writeFileSync(fullPath, String(content), 'utf-8');
        created.push(safeName);
    }

    return { success: true, message: `Project created at ${cleanPath}`, files: created };
}

if (require.main === module) {
    const input = JSON.parse(process.argv[2] || '{}');
    if (input.type === 'cmd') executeCmd(input.command).then(res => console.log(JSON.stringify(res)));
    if (input.type === 'python') executePython(input.filePath).then(res => console.log(JSON.stringify(res)));
    if (input.type === 'project') console.log(JSON.stringify(createProject(input)));
}

module.exports = { executeCmd, executePython, createProject };