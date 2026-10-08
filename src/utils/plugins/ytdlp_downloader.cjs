// src/utils/plugins/ytdlp_downloader.cjs
const { execSync } = require('child_process');
const path = require('path');
const os = require('os');
const fs = require('fs');

const DOWNLOAD_DIR = path.join(os.homedir(), 'Downloads', 'ALSA-YT');
fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

function downloadMedia({ url, mode = 'best', quality = 'best' }) {
    if (!url) return { success: false, error: 'URL required' };

    let format = 'bv*+ba/b';
    if (mode === 'audio') format = 'bestaudio/best';
    else if (quality !== 'best') format = `bv*[height<=${quality}]+ba/b[height<=${quality}]`;

    const command = `yt-dlp -f "${format}" -P "${DOWNLOAD_DIR}" "${url}"`;

    try {
        const stdout = execSync(command, { encoding: 'utf-8', timeout: 300000 });
        return { success: true, message: 'Download finished', output: stdout, dir: DOWNLOAD_DIR };
    } catch (err) {
        return { success: false, error: err.message };
    }
}

if (require.main === module) {
    const input = JSON.parse(process.argv[2] || '{}');
    console.log(JSON.stringify(downloadMedia(input)));
}

module.exports = { downloadMedia, DOWNLOAD_DIR };