# 📤 telegram-file-uploader-js

A lightweight Node.js utility to upload **images**, **videos**, **audio**, or **documents** to Telegram via bot and
retrieve direct CDN file links.

> ⚡ Ideal for developers who want to use Telegram as a free media hosting service (CDN-like).

---

## 📦 Installation

```bash
npm install telegram-file-uploader-js
```

---

## 🚀 Usage

### Upload a single file

``` bash
const { uploadToTelegram } = require('telegram-file-uploader-js');

const botToken = 'YOUR_BOT_TOKEN'; // From @BotFather
const chatId = '@your_channel_or_-100xxxxxxx'; // Public channel or private group ID

uploadToTelegram('./public/image.jpg', 'image/jpeg', botToken, chatId)
.then(console.log)
.catch(console.error);
```

### Upload multiple files

```bash
const { uploadMultipleFiles } = require('telegram-file-uploader-js');

const files = [
  { filePath: './public/image.jpg', mimeType: 'image/jpeg' },
  { filePath: './public/video.mp4', mimeType: 'video/mp4' },
];

uploadMultipleFiles(files, botToken, chatId)
  .then(console.log)
  .catch(console.error);
```

### Example result

```bash
{
  "success": true,
  "file_id": "BAACAgUAAx...",
  "message_id": 7,
  "public_url": "https://api.telegram.org/file/bot<YOUR_BOT_TOKEN>/file_path.ext"
}
```

---

## 📚 API Reference

### `uploadToTelegram(filePath, mimeType, botToken, chatId)`

| Parameter  | Type     | Description                                    |
|------------|----------|------------------------------------------------|
| `filePath` | `string` | Local file path                                |
| `mimeType` | `string` | MIME type of the file (e.g., `image/png`)      |
| `botToken` | `string` | Telegram bot token (from @BotFather)           |
| `chatId`   | `string` | Target `@channel` username or private group ID |

#### Returns:

```bash
{
  success: boolean;
  file_id: string | null;
  message_id: number;
  public_url: string | null;
}
```

### `uploadMultipleFiles(files, botToken, chatId, delayMs?)`

Uploads an array of files sequentially with optional delay (default: `1000ms`).

| Parameter  | Type                            | Description                                   |
|------------|---------------------------------|-----------------------------------------------|
| `files`    | `Array<{ filePath, mimeType }>` | List of files to upload                       |
| `botToken` | `string`                        | Telegram bot token                            |
| `chatId`   | `string`                        | Channel username or private group ID          |
| `delayMs`  | `number` (optional)             | Delay between uploads in ms (default: `1000`) |

#### Returns:

Array of individual upload results (same format as `uploadToTelegram`).

### `getFileUrl(fileId, botToken)`

| Parameter  | Type     | Description                      |
|------------|----------|----------------------------------|
| `fileId`   | `string` | `file_id` returned from Telegram |
| `botToken` | `string` | Telegram bot token               |

#### Returns:

```bash
string // Telegram CDN direct link
```

---

## 🧱 Supported MIME Types

| File Type | MIME Type Examples                       |
|-----------|------------------------------------------|
| Image     | `image/jpeg`, `image/png`                |
| Video     | `video/mp4`, `video/quicktime`           |
| Audio     | `audio/mpeg`, `audio/wav`                |
| Document  | `application/pdf`, `.zip`, `.docx`, etc. |

---

## 🔐 Security Notes

- Never expose your bot token on the frontend or client-side apps.

- public_url only works for public channels.

- For private groups, use getFileUrl() and serve files via your own proxy/CDN.

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