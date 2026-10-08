// src/utils/plugins/music_player.cjs
const fs = require('fs');
const path = require('path');
const os = require('os');
const { exec } = require('child_process');

const MUSIC_PATHS = [
    path.join(os.homedir(), 'Music'),
    'D:\\Music',
    'E:\\Music'
];

function getSongs() {
    const songs = [];
    const validExts = ['.mp3', '.wav', '.flac', '.m4a', '.aac'];

    MUSIC_PATHS.forEach(basePath => {
        if (fs.existsSync(basePath)) {
            const scanDir = (dir) => {
                const files = fs.readdirSync(dir);
                files.forEach(file => {
                    const fullPath = path.join(dir, file);
                    if (fs.statSync(fullPath).isDirectory()) {
                        scanDir(fullPath);
                    } else if (validExts.includes(path.extname(file).toLowerCase())) {
                        songs.append({ name: path.parse(file).name, path: fullPath });
                    }
                });
            };
            scanDir(basePath);
        }
    });

    return { success: true, songs, count: songs.length };
}

function playSong(songPath) {
    if (!fs.existsSync(songPath)) return { success: false, error: 'File not found' };
    exec(`start "" "${songPath}"`);
    return { success: true, message: `Playing: ${path.basename(songPath)}` };
}

function stopSong() {
    exec('taskkill /F /IM wmplayer.exe /IM groove.exe');
    return { success: true, message: 'Music stopped' };
}

if (require.main === module) {
    const input = JSON.parse(process.argv[2] || '{}');
    if (input.action === 'get') console.log(JSON.stringify(getSongs()));
    if (input.action === 'play') console.log(JSON.stringify(playSong(input.path)));
    if (input.action === 'stop') console.log(JSON.stringify(stopSong()));
}

module.exports = { getSongs, playSong, stopSong };