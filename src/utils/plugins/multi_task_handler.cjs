// src/utils/plugins/multi_task_handler.cjs
const { exec, execSync } = require('child_process');
const { keyboard, Key, mouse, Point, Button } = require("@nut-tree-fork/nut-js");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Dynamic Installed Apps Cache
let installedAppsCache = null;

// Function to dynamically scan all installed applications on Windows
function getInstalledApps() {
    if (installedAppsCache) return installedAppsCache;

    const psCommand = `
    $apps = @();
    $paths = @(
        "$env:ProgramData\\Microsoft\\Windows\\Start Menu\\Programs",
        "$env:AppData\\Microsoft\\Windows\\Start Menu\\Programs"
    );
    
    foreach ($path in $paths) {
        if (Test-Path $path) {
            Get-ChildItem -Path $path -Recurse -Include *.lnk, *.exe | ForEach-Object {
                $apps += [PSCustomObject]@{
                    name = $_.BaseName.ToLower();
                    path = $_.FullName
                }
            }
        }
    }
    $apps | ConvertTo-Json -Compress
    `.replace(/\n/g, ' ');

    try {
        const stdout = execSync(`powershell -NoProfile -ExecutionPolicy Bypass -Command "${psCommand}"`, { encoding: 'utf-8' });
        const parsed = JSON.parse(stdout || '[]');

        const appMap = {};
        parsed.forEach(item => {
            if (item.name && item.path) {
                // Remove extra spaces & dynamic naming clean
                const cleanName = item.name.replace(/[^a-zA-Z0-9]/g, '');
                appMap[cleanName] = item.path;
                appMap[item.name] = item.path;
            }
        });

        installedAppsCache = appMap;
        return appMap;
    } catch (err) {
        console.error("Error scanning installed apps:", err.message);
        return {};
    }
}

// Open App Dynamically
function launchApp(appName) {
    return new Promise((resolve) => {
        const apps = getInstalledApps();
        const normalizedName = appName.toLowerCase().trim().replace(/[^a-zA-Z0-9]/g, '');

        // Find best matching installed application
        let targetPath = apps[normalizedName] || apps[appName.toLowerCase()];

        // Fallback to direct Windows Start command if exact shortcut not found
        const finalCommand = targetPath ? `start "" "${targetPath}"` : `start ${appName}`;

        exec(finalCommand, (err) => {
            if (err) resolve({ success: false, error: err.message });
            else resolve({ success: true, message: `Opened ${appName}` });
        });
    });
}

// Handler for tasks
async function executeMultiTask(taskPlan) {
    const results = [];

    for (const step of taskPlan) {
        console.log(`Executing step: ${step.app} -> ${step.action}`);

        if (step.action === 'open' || step.action === 'launch') {
            const res = await launchApp(step.app);
            results.push(res);
            await sleep(1500);
        }

        else if (step.action === 'write_text') {
            if (step.app) await launchApp(step.app);
            await sleep(1500);

            if (step.content) {
                await keyboard.type(step.content);
                results.push({ success: true, message: `Wrote text in ${step.app}` });
            }
        }

        else if (step.action === 'get_apps') {
            const apps = getInstalledApps();
            results.push({ success: true, totalApps: Object.keys(apps).length, apps: Object.keys(apps) });
        }
    }

    return { success: true, stepsExecuted: results };
}

module.exports = { executeMultiTask, launchApp, getInstalledApps };

if (require.main === module) {
    const plan = JSON.parse(process.argv[2] || '[]');
    executeMultiTask(plan).then((res) => console.log(JSON.stringify(res)));
}