const koffi = require("koffi");

// Load Windows user32.dll
const user32 = koffi.load("user32.dll");

// Define C Types
const HWND = koffi.alias("HWND", "intptr_t");
const BOOL = koffi.alias("BOOL", "int");
const LPARAM = koffi.alias("LPARAM", "intptr_t");

// Define Callback Prototype for EnumWindows (Return int instead of bool to avoid Koffi type mismatch)
const EnumWindowsProc = koffi.proto("int __stdcall EnumWindowsProc(HWND hwnd, LPARAM lParam)");

// Bind Win32 Functions
const EnumWindows = user32.func("BOOL __stdcall EnumWindows(EnumWindowsProc *lpEnumFunc, LPARAM lParam)");
const GetWindowTextW = user32.func("int __stdcall GetWindowTextW(HWND hWnd, uint16_t *lpString, int nMaxCount)");
const IsWindowVisible = user32.func("BOOL __stdcall IsWindowVisible(HWND hWnd)");
const SetForegroundWindow = user32.func("BOOL __stdcall SetForegroundWindow(HWND hWnd)");
const ShowWindow = user32.func("BOOL __stdcall ShowWindow(HWND hWnd, int nCmdShow)");

// ShowWindow Constants
const SW_MINIMIZE = 6;
const SW_MAXIMIZE = 3;
const SW_RESTORE = 9;

class WindowController {
    // Current Open Windows List Fetch Karna
    getOpenWindows() {
        const windows = [];

        // Register Callback Function (Returns 1 for continue enumeration)
        const callback = koffi.register((hwnd, lParam) => {
            if (IsWindowVisible(hwnd)) {
                const buffer = new Uint16Array(256);
                const length = GetWindowTextW(hwnd, buffer, 256);

                if (length > 0) {
                    const title = String.fromCharCode(...buffer.slice(0, length));
                    windows.push({ hwnd, title });
                }
            }
            return 1; // Win32 API expects int 1 (TRUE) to continue enumerating
        }, koffi.pointer(EnumWindowsProc));

        EnumWindows(callback, 0);
        koffi.unregister(callback);

        return windows;
    }

    // Title ke basis par window search karna
    findWindowByTitle(titleSubstring) {
        const windows = this.getOpenWindows();
        return windows.find(w => w.title.toLowerCase().includes(titleSubstring.toLowerCase()));
    }

    // Target App Window ko Screen ke Front par laana
    focusWindow(titleSubstring) {
        const target = this.findWindowByTitle(titleSubstring);
        if (target) {
            ShowWindow(target.hwnd, SW_RESTORE);
            SetForegroundWindow(target.hwnd);
            console.log(`🎯 Focused Window: "${target.title}"`);
            return true;
        }
        console.log(`❌ Window not found matching: "${titleSubstring}"`);
        return false;
    }

    // Window Maximize karna
    maximizeWindow(titleSubstring) {
        const target = this.findWindowByTitle(titleSubstring);
        if (target) {
            ShowWindow(target.hwnd, SW_MAXIMIZE);
            console.log(`🔲 Maximized Window: "${target.title}"`);
            return true;
        }
        return false;
    }

    // Window Minimize karna
    minimizeWindow(titleSubstring) {
        const target = this.findWindowByTitle(titleSubstring);
        if (target) {
            ShowWindow(target.hwnd, SW_MINIMIZE);
            console.log(`🔽 Minimized Window: "${target.title}"`);
            return true;
        }
        return false;
    }
}

// Direct Test Execution
if (require.main === module) {
    const winCtrl = new WindowController();

    console.log("🔍 Fetching all open visible windows...");
    const windows = winCtrl.getOpenWindows();
    console.log(windows.map(w => w.title));

    // Test: Active app window bring to front
    setTimeout(() => {
        console.log("\n🚀 Testing Window Focus...");
        winCtrl.focusWindow("Paint") || winCtrl.focusWindow("Visual Studio Code");
    }, 1500);
}

module.exports = WindowController;