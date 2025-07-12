const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');
const { getFileUrl } = require('./getFileUrl');

/**
 * Upload a single file to Telegram.
 * @param {string} filePath - Local file path.
 * @param {string} mimeType - MIME type (e.g., image/png, video/mp4).
 * @param {string} botToken - Telegram Bot Token.
 * @param {string} chatId - Target chat ID (e.g. @channel or -100xxxxx).
 * @returns {Promise<Object>} Upload result.
 */
async function uploadToTelegram(filePath, mimeType, botToken, chatId) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`File not found: ${filePath}`);
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
        const response = await axios.post(apiUrl, form, { headers: form.getHeaders() });
        const result = response.data.result;

        const fileInfo = result[typeField];
        const fileId = Array.isArray(fileInfo)
            ? fileInfo.at(-1)?.file_id
            : fileInfo?.file_id || null;

        const publicUrl = fileId ? await getFileUrl(fileId, botToken) : null;

        return {
            success: true,
            file_id: fileId,
            message_id: result.message_id,
            public_url: publicUrl,
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data || error.message,
        };
    }
}

/**
 * Upload multiple files to Telegram sequentially.
 * @param {Array<{filePath: string, mimeType: string}>} files
 * @param {string} botToken
 * @param {string} chatId
 * @param {number} delayMs
 * @returns {Promise<Array>} Array of upload results
 */
async function uploadMultipleFiles(files, botToken, chatId, delayMs = 1000) {
    const results = [];

    for (const { filePath, mimeType } of files) {
        try {
            const res = await uploadToTelegram(filePath, mimeType, botToken, chatId);
            results.push(res);
        } catch (err) {
            results.push({ success: false, error: err.message });
        }

        await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    return results;
}

module.exports = {
    uploadToTelegram,
    uploadMultipleFiles,
    getFileUrl,
};
