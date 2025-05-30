# KAISAR MINING BOT

A Node.js automation bot for managing and monitoring multiple mining accounts on Kaisar. The bot displays real-time mining status for all your accounts in a clean, dynamic terminal table.

## Features
- **Multi-account support:** Manage unlimited accounts by adding tokens to `data.txt`.
- **Real-time status table:** See all mining sessions, points, and countdowns in one dynamic table.
- **Automatic session management:** Bot will auto-restart mining sessions as needed.
- **UID display:** Easily identify each account by its unique UID.
- **Clean, modular codebase:** Easy to maintain and extend.

## Registration
Register your Kaisar account [here](https://zero.kaisar.io/register?ref=burpCL740)

## Folder Structure
```
Kaisar-BOT/
├── main.js                # Entry point
├── data.txt               # List of account tokens (one per line)
├── src/
│   ├── core/
│   │   └── automation.js  # Main automation logic
│   ├── services/
│   │   └── miningApi.js   # API service functions
│   ├── utils/
│   │   └── file.js        # File utilities
│   └── cli/
│       └── table.js       # Table display logic
├── package.json
└── README.md
```

## Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/WINGFO-HQ/Kaisar-BOT.git
   cd Kaisar-BOT
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```

## Usage
1. **Add your account tokens:**
   - Open `data.txt` and paste one token per line. Each line represents a different account.
2. **Start the bot:**
   ```bash
   npm start
   ```
   or
   ```bash
   node main.js
   ```
3. **View the terminal:**
   - The table will update every second, showing all account statuses, session countdowns, and more.

## How to Add Accounts
- Each line in `data.txt` should contain a valid Kaisar account token.
- To add more accounts, simply add more lines (tokens) to `data.txt`.

## How to Get Your Token
To get your Kaisar account token:
1. Open the Kaisar extension popup in your browser.
2. Press `F12` or right-click and choose `Inspect` to open Developer Tools.
3. Go to the `Network` tab and interact with the extension (e.g., start mining).
4. Look for a request with an `authorization` header.
5. Copy the value of the `authorization` header (the token).
6. Paste this token as a new line in your `data.txt` file.

## Support & Community
- Join the Telegram channel: [Info Min (WINGFO)](https://t.me/infomindao)

## License
MIT
