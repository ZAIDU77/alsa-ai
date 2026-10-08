const fs = require("fs");
const path = require("path");
const chokidar = require("chokidar");

class FileController {
    constructor() {
        this.watcher = null;
    }

    // File Read
    readFile(filePath) {
        try {
            const absolutePath = path.resolve(filePath);
            if (!fs.existsSync(absolutePath)) {
                console.error(`❌ File not found: ${absolutePath}`);
                return null;
            }
            return fs.readFileSync(absolutePath, "utf-8");
        } catch (error) {
            console.error(`❌ Read Error: ${error.message}`);
            return null;
        }
    }

    // File Create ya Write
    writeFile(filePath, content) {
        try {
            const absolutePath = path.resolve(filePath);
            const dir = path.dirname(absolutePath);

            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(absolutePath, content, "utf-8");
            console.log(`✅ File Written Successfully: ${absolutePath}`);
            return true;
        } catch (error) {
            console.error(`❌ Write Error: ${error.message}`);
            return false;
        }
    }

    // File Delete
    deleteFile(filePath) {
        try {
            const absolutePath = path.resolve(filePath);
            if (fs.existsSync(absolutePath)) {
                fs.unlinkSync(absolutePath);
                console.log(`🗑️ File Deleted: ${absolutePath}`);
                return true;
            }
            console.log(`⚠️ File does not exist: ${absolutePath}`);
            return false;
        } catch (error) {
            console.error(`❌ Delete Error: ${error.message}`);
            return false;
        }
    }

    // Directory Real-Time Monitoring Start Karna (Chokidar)
    watchDirectory(dirPath, onChangeCallback) {
        const absolutePath = path.resolve(dirPath);
        console.log(`👀 Watching Directory for Changes: ${absolutePath}`);

        this.watcher = chokidar.watch(absolutePath, {
            ignored: /(^|[\/\\])\../, // Ignore hidden files
            persistent: true,
            ignoreInitial: true
        });

        this.watcher
            .on("add", path => {
                console.log(`📁 File Created: ${path}`);
                if (onChangeCallback) onChangeCallback("add", path);
            })
            .on("change", path => {
                console.log(`📝 File Modified: ${path}`);
                if (onChangeCallback) onChangeCallback("change", path);
            })
            .on("unlink", path => {
                console.log(`🗑️ File Removed: ${path}`);
                if (onChangeCallback) onChangeCallback("unlink", path);
            });
    }

    // Stop Monitoring
    stopWatching() {
        if (this.watcher) {
            this.watcher.close();
            console.log("🛑 Directory Watcher Stopped.");
        }
    }
}

// Test Execution Logic
if (require.main === module) {
    const fileCtrl = new FileController();
    const testDir = "./temp_test_dir";
    const testFile = `${testDir}/demo.txt`;

    // 1. Directory Watcher Active Karo
    fileCtrl.watchDirectory(testDir);

    // 2. Test Operations
    setTimeout(() => {
        console.log("\n🚀 Testing File Creation...");
        fileCtrl.writeFile(testFile, "Hello Alsa AI - Live File Controller Test!");
    }, 1000);

    setTimeout(() => {
        console.log("\n🚀 Testing File Read...");
        const content = fileCtrl.readFile(testFile);
        console.log(`📄 Read Content: "${content}"`);
    }, 2500);

    setTimeout(() => {
        console.log("\n🚀 Testing File Deletion...");
        fileCtrl.deleteFile(testFile);
    }, 4000);

    // Cleanup & Exit
    setTimeout(() => {
        fileCtrl.stopWatching();
        if (fs.existsSync(testDir)) fs.rmdirSync(testDir);
        process.exit(0);
    }, 5500);
}

module.exports = FileController;