# 📤 telegram-file-uploader

A simple Node.js utility to upload **images**, **videos**, **audio**, or **documents** to Telegram via bot, and retrieve direct file links.

> ⚡ Ideal for developers who want to use Telegram as a free file hosting (CDN-like).

---

## 📦 Installation

```bash
npm install telegram-file-uploader
```

---

## 🚀 Usage

Upload a file

```bash
const { uploadToTelegram } = require('telegram-file-uploader');

(async () => {
  const result = await uploadToTelegram(
    './media/sample.mp3',             // Local file path
    'audio/mpeg',                     // MIME type
    'YOUR_BOT_TOKEN',                 // From @BotFather
    '@your_channel_or_-100xxxxxxx'   // Public channel (@username) or private group ID
  );

  console.log('📤 Upload result:', result);
})();

```

Example result

```bash
{
  "success": true,
  "file_id": "BAACAgUAAx...",
  "message_id": 7,
  "public_url": "https://t.me/YourChannel/7"
}
```

Get direct file URL

```bash
const { getFileUrl } = require('telegram-file-uploader');

(async () => {
  const directUrl = await getFileUrl(
    'BAACAgUAAx...',   // file_id
    'YOUR_BOT_TOKEN'
  );

  console.log('✅ Direct file URL:', directUrl);
})();
```

Output example:

```bash
✅ Direct file URL: https://api.telegram.org/file/bot<YOUR_BOT_TOKEN>/music/file_2.mp3
```

---

## 📚 API Reference
### `uploadToTelegram(filePath, mimeType, botToken, chatId)`
| Param      | Type   | Description                                    |
| ---------- | ------ | ---------------------------------------------- |
| `filePath` | string | Local file path                                |
| `mimeType` | string | File MIME type (e.g. `image/png`, `video/mp4`) |
| `botToken` | string | Telegram bot token from @BotFather             |
| `chatId`   | string | `@channel` or `-100xxxxxx` private group ID    |

Returns

```bash
{
  success: boolean;
  file_id: string | null;
  message_id: number;
  public_url: string | null;
}
```

### `getFileUrl(fileId, botToken)`
| Param      | Type   | Description                  |
| ---------- | ------ | ---------------------------- |
| `fileId`   | string | File ID returned from upload |
| `botToken` | string | Telegram bot token           |

Returns

```bash
  string // Telegram CDN direct link
```

---

## 🧱 Supported MIME Types

| File Type | MIME Type Examples                       |
| --------- | ---------------------------------------- |
| Image     | `image/jpeg`, `image/png`                |
| Video     | `video/mp4`, `video/quicktime`           |
| Audio     | `audio/mpeg`, `audio/wav`                |
| Document  | `application/pdf`, `.zip`, `.docx`, etc. |

---

## 🔐 Security Notes

- Do NOT expose your bot token to the frontend/browser.

- public_url is only available for public channels (not private groups).

- For private groups, use getFileUrl() and host the result via proxy or direct link.

---

## ⚙️ Telegram Setup Guide
1. Create a bot via: Use [@BotFather](https://t.me/botfather).
2. Add the bot to your group or channel.
3. Make sure the bot is admin (to send media).
4. To get `chat_id` of a private group:
    - Add the bot
    - Send any message
    - Call this:
    - ```bash
      https://api.telegram.org/bot<your_bot_token>/getUpdates
      ```
    - Look for `chat.id` in the response.

## 🪪 License
MIT © nguyentrongbut