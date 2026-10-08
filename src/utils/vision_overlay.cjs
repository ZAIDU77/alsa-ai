const { mouse, Point, straightTo, Button } = require("@nut-tree-fork/nut-js");

mouse.config.mouseSpeed = 1000;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class VisionOverlayController {
    // Screen coordinate par bounding box highlight simulation (Cursor trace)
    async highlightBoundingBox(x, y, width, height) {
        console.log(`👁️ Vision Overlay: Highlighting Region [X:${x}, Y:${y}, W:${width}, H:${height}]`);

        // Corner Points
        const topLeft = new Point(x, y);
        const topRight = new Point(x + width, y);
        const bottomRight = new Point(x + width, y + height);
        const bottomLeft = new Point(x, y + height);

        // Scan/Outline Animation
        await mouse.move(straightTo(topLeft));
        await sleep(50);
        await mouse.move(straightTo(topRight));
        await sleep(50);
        await mouse.move(straightTo(bottomRight));
        await sleep(50);
        await mouse.move(straightTo(bottomLeft));
        await sleep(50);
        await mouse.move(straightTo(topLeft));
    }

    // Precise Target Click (UI Element Precision Click)
    async clickElement(x, y, label = "Element") {
        console.log(`🎯 Vision Target Click: Executing click on "${label}" at (${x}, ${y})`);

        const targetPoint = new Point(x, y);
        await mouse.move(straightTo(targetPoint));
        await sleep(100);
        await mouse.click(Button.LEFT);
        console.log(`✅ Clicked "${label}" successfully.`);
    }

    // Center Coordinate Calculator (for OCR Bounding Boxes)
    calculateCenter(bbox) {
        // Expected format: bbox = { x, y, width, height }
        return {
            x: Math.round(bbox.x + bbox.width / 2),
            y: Math.round(bbox.y + bbox.height / 2)
        };
    }
}

// Direct Test Logic
if (require.main === module) {
    (async () => {
        const vision = new VisionOverlayController();

        // Sample Detected UI Element (e.g. Start Button / Icon)
        const mockDetectedElement = {
            label: "Test Target Area",
            x: 600,
            y: 400,
            width: 150,
            height: 80
        };

        console.log("🚀 Testing Vision Bounding Box Highlight...");
        await vision.highlightBoundingBox(
            mockDetectedElement.x,
            mockDetectedElement.y,
            mockDetectedElement.width,
            mockDetectedElement.height
        );

        const center = vision.calculateCenter(mockDetectedElement);
        console.log(`📍 Calculated Center: X:${center.x}, Y:${center.y}`);

        await sleep(500);
        await vision.clickElement(center.x, center.y, mockDetectedElement.label);

        console.log("✨ Vision Overlay & Precision Click Test Complete!");
    })();
}

module.exports = VisionOverlayController;