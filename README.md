# Discord Currency Bot

A simple Discord bot for currency, banking, and gambling, using a JSON file for persistent storage.

**GitHub:** [https://github.com/kiaann1/Discord-Currency-Bot](https://github.com/kiaann1/Discord-Currency-Bot)

## Features

- Bank and cash system (`.bal`, `.dep`, `.with`)
- Coinflip gambling (`.coinflip`, `.cf`)
- Developer grant command (`.grand100`)
- JSON-based storage (no external database required)

## Setup

1. **Clone the repository:**
   ```sh
   git clone https://github.com/kiaann1/Discord-Currency-Bot.git
   cd Discord-Currency-Bot
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Create a Bot:**
   - Create a bot using Discord Developer Portal
   
4. **Configure your bot:**
   - Set your Discord bot token in your environment or config as required by your `index.js`.

5. **Run the bot:**
   ```sh
   npm start
   ```

## Commands

- `.bal`  
  Show your cash and bank balance.

- `.dep <amount|all>`  
  Deposit cash into your bank.

- `.with <amount|all>`  
  Withdraw cash from your bank.

- `.coinflip <amount> <heads|tails>` or `.cf <amount> <h|t>`  
  Gamble your cash on a coinflip.


## Data Storage

- The bot will create this file and directory automatically if they do not exist.

## Notes

- Make sure your bot has permission to read and write files in the project directory.

---

**Enjoy your Discord Currency Bot!**
