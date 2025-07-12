const axios = require('axios');

/**
 * Get Telegram file direct URL (for CDN-like usage).
 * @param {string} fileId - Telegram file_id (from upload result).
 * @param {string} botToken - Your Telegram bot token.
 * @returns {Promise<string>} - Direct file URL to use in <img>, <video>, etc.
 */
async function getFileUrl(fileId, botToken) {
    try {
        const res = await axios.get(`https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`);
        const filePath = res.data.result.file_path;
        return `https://api.telegram.org/file/bot${botToken}/${filePath}`;
    } catch (err) {
        throw new Error('Failed to get file URL: ' + err.message);
    }
}

module.exports = {
    getFileUrl,
};
