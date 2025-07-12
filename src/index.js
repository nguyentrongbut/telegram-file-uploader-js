const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { getFileUrl } = require('./getFileUrl');

/**
 * Upload a file to Telegram (image, video, audio, or document).
 */
async function uploadToTelegram(filePath, mimeType, botToken, chatId) {
    if (!fs.existsSync(filePath)) {
        throw new Error('File path does not exist.');
    }

    if (!botToken || !chatId || !mimeType) {
        throw new Error('Missing required parameters: botToken, chatId, mimeType.');
    }

    const { endpoint, typeField } = (() => {
        if (mimeType.startsWith('image/')) return { endpoint: 'sendPhoto', typeField: 'photo' };
        if (mimeType.startsWith('video/')) return { endpoint: 'sendVideo', typeField: 'video' };
        if (mimeType.startsWith('audio/')) return { endpoint: 'sendAudio', typeField: 'audio' };
        return { endpoint: 'sendDocument', typeField: 'document' };
    })();

    const apiUrl = `https://api.telegram.org/bot${botToken}/${endpoint}`;
    const form = new FormData();
    form.append(typeField, fs.createReadStream(filePath), path.basename(filePath));
    form.append('chat_id', chatId);

    try {
        const response = await axios.post(apiUrl, form, {
            headers: form.getHeaders(),
        });

        const result = response.data.result;
        const messageId = result.message_id;

        let fileId = null;
        if (Array.isArray(result[typeField])) {
            fileId = result[typeField].at(-1)?.file_id || null;
        } else if (result[typeField]?.file_id) {
            fileId = result[typeField].file_id;
        }

        const publicUrl = fileId ? await getFileUrl(fileId, botToken) : null;

        return {
            success: true,
            file_id: fileId,
            message_id: messageId,
            public_url: publicUrl,
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || error.message,
        };
    }
}

module.exports = {
    uploadToTelegram,
};
