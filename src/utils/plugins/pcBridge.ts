// src/utils/pcBridge.ts
import { createPowerPoint } from './ppt_creator.cjs';
import { createExcel } from './excel_creator.cjs';
import { createDatabase } from './db_creator.cjs';
import { sendTelegramMessage, sendWhatsAppMessage } from './messaging_automation.cjs';
import { getSongs, playSong, stopSong } from './music_player.cjs';
import { downloadMedia } from './ytdlp_downloader.cjs';
import { scanSystem } from './scan_system.cjs';
import { executeCmd, executePython, createProject } from './execute_system.cjs';


export async function handleBridgeRoute(route: string, payload: any) {
    switch (route) {
        case '/scan':
            return scanSystem();
        case '/execute_cmd':
            return await executeCmd(payload.command);
        case '/execute_python':
            return await executePython(payload.file_path);
        case '/create_project':
            return createProject(payload);
        case '/create_powerpoint':
            return createPowerPoint(payload);
        case '/create_excel':
            return createExcel(payload);
        case '/create_database':
            return await createDatabase(payload);
        case '/telegram-msg':
            return await sendTelegramMessage(payload.link, payload.message);
        case '/whatsapp-msg':
            return await sendWhatsAppMessage(payload.phone, payload.message);
        case '/get_songs':
            return getSongs();
        case '/play_song':
            return playSong(payload.song_path);
        case '/stop_song':
            return stopSong();
        case '/ytdlp/download':
            return downloadMedia(payload);
        default:
            return { success: false, error: `Route ${route} not supported` };
    }
}