const { mouse, straightTo, Button, Point } = require("@nut-tree-fork/nut-js");
const { exec } = require("child_process");

mouse.config.mouseSpeed = 900;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Straight line with human drag physics
async function drawLine(startX, startY, endX, endY, steps = 15) {
    await mouse.move(straightTo(new Point(startX, startY)));
    await sleep(20);
    await mouse.pressButton(Button.LEFT);

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const x = Math.round(startX + (endX - startX) * t);
        const y = Math.round(startY + (endY - startY) * t);
        await mouse.move(straightTo(new Point(x, y)));
        await sleep(5);
    }

    await mouse.releaseButton(Button.LEFT);
    await sleep(30);
}

// Rectangle Drawer (for Wall, Door, Window)
async function drawRect(x, y, width, height) {
    await drawLine(x, y, x + width, y);          // Top
    await drawLine(x + width, y, x + width, y + height); // Right
    await drawLine(x + width, y + height, x, y + height); // Bottom
    await drawLine(x, y + height, x, y);          // Left
}

async function drawPerfectHut() {
    console.log("🚀 MS Paint open ho raha hai...");
    exec("start /max mspaint");
    await sleep(8000);

    console.log("🏠 Drawing High-Precision Hut...");

    // Center Reference Point
    const cx = 500;
    const cy = 250;

    // 1. MAIN WALL (Body)
    await drawRect(cx, cy + 100, 300, 200);

    // 2. ROOF (Symmetric Triangle & Overhang)
    await drawLine(cx - 30, cy + 100, cx + 150, cy);        // Left Slope Up
    await drawLine(cx + 150, cy, cx + 330, cy + 100);       // Right Slope Down
    await drawLine(cx - 30, cy + 100, cx + 330, cy + 100);   // Roof Base Line

    // 3. DOOR
    await drawRect(cx + 120, cy + 180, 60, 120);
    // Door Knob
    await drawLine(cx + 168, cy + 240, cx + 172, cy + 240);

    // 4. WINDOW 1 (Left)
    await drawRect(cx + 30, cy + 140, 50, 50);
    await drawLine(cx + 55, cy + 140, cx + 55, cy + 190);   // Window Vertical Grid
    await drawLine(cx + 30, cy + 165, cx + 80, cy + 165);   // Window Horizontal Grid

    // 5. WINDOW 2 (Right)
    await drawRect(cx + 220, cy + 140, 50, 50);
    await drawLine(cx + 245, cy + 140, cx + 245, cy + 190);  // Window Vertical Grid
    await drawLine(cx + 220, cy + 165, cx + 270, cy + 165);  // Window Horizontal Grid

    // 6. CHIMNEY
    await drawLine(cx + 220, cy + 48, cx + 220, cy - 20);
    await drawLine(cx + 220, cy - 20, cx + 250, cy - 20);
    await drawLine(cx + 250, cy - 20, cx + 250, cy + 68);

    // 7. PATHWAY (Front Ground)
    await drawLine(cx + 120, cy + 300, cx + 80, cy + 420);
    await drawLine(cx + 180, cy + 300, cx + 220, cy + 420);

    console.log("✨ Perfect Hut Sketch Complete!");
}

drawPerfectHut().catch(console.error);