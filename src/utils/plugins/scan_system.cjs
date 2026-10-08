// src/utils/plugins/scan_system.cjs
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

function getInstalledApps() {
    const psCommand = `
    $apps = @();$paths = @(
        "$env:ProgramData\\Microsoft\\Windows\\Start Menu\\Programs",
        "$env:AppData\\Microsoft\\Windows\\Start Menu\\Programs"
    );
    foreach ($path in$paths) {
        if (Test-Path $path) {
            Get-ChildItem -Path $path -Recurse -Include *.lnk, *.exe | ForEach-Object {
                $apps +=$_.BaseName
            }
        }
    }
    $apps | Select-Object -Unique | ConvertTo-Json -Compress
    `.replace(/\n/g, ' ');

    try {
        const stdout = execSync(`powershell -NoProfile -ExecutionPolicy Bypass -Command "${psCommand}"`, { encoding: 'utf-8' });
        return JSON.parse(stdout || '[]');
    } catch (e) {
        return [];
    }
}

function scanSystem() {
    const userPath = os.homedir();
    const commonFolders = ['Desktop', 'Documents', 'Downloads', 'Music', 'Videos'].filter(f =>
        fs.existsSync(path.join(userPath, f))
    );

    const recentPath = path.join(process.env.APPDATA || '', 'Microsoft', 'Windows', 'Recent');
    let recentFiles = [];
    if (fs.existsSync(recentPath)) {
        recentFiles = fs.readdirSync(recentPath).slice(0, 10);
    }

    return {
        success: true,
        data: {
            applications: getInstalledApps().slice(0, 50),
            commonFolders,
            recentFiles
        }
    };
}

if (require.main === module) {
    console.log(JSON.stringify(scanSystem()));
}

module.exports = { scanSystem, getInstalledApps };