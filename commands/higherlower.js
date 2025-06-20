import { getCash, addCash } from '../currency.js';

const MIN_BET = 50;
const MAX_BET = 500000;

// In-memory session store: { [userId]: { bet, current, streak, profit } }
export const sessions = {};

function getRandomNumber() {
  return Math.floor(Math.random() * 10) + 1; // 1-10
}

export default {
  name: 'hl',
  description: 'Start a higher or lower game. Usage: .hl <amount>',
  execute(message, args) {
    const userId = message.author.id;
    if (sessions[userId]) {
      message.reply('You already have an active higher or lower game! Use .high or .low to continue, or .ff to end the game.');
      return;
    }
    if (args.length < 1) {
      message.reply('Usage: .hl <amount>');
      return;
    }
    let amount = parseInt(args[0], 10);
    if (isNaN(amount) || amount <= 0) {
      message.reply('Please specify a valid amount to bet.');
      return;
    }
    if (amount < MIN_BET) {
      message.reply(`The minimum bet is ${MIN_BET} coins.`);
      return;
    }
    if (amount > MAX_BET) {
      message.reply(`The maximum bet is ${MAX_BET} coins.`);
      return;
    }
    if (getCash(userId) < amount) {
      message.reply('Insufficient funds: Use .withdraw <amount> to withdraw from your bank.');
      return;
    }
    addCash(userId, -amount);
    const current = getRandomNumber(); // 1-10
    sessions[userId] = { bet: amount, current, streak: 0, profit: 0 };
    message.reply(`Game started! The number is **${current}**. Guess .high or .low!`);
  }
};