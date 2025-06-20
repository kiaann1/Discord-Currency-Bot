import { getCash, addCash, getTotalBalance } from '../currency.js';

const MIN_BET = 50;
const MAX_BET = 500000;

function formatCoins(n) {
  return n.toLocaleString();
}

export default {
  name: 'bet',
  description: 'Bet an amount for a 49% chance to double it. Usage: .bet <amount> or .bet all',
  execute(message, args) {
    if (args.length < 1) {
      message.reply('Usage: .bet <amount> or .bet all');
      return;
    }
    const userId = message.author.id;
    let amount;
    if (typeof args[0] === 'string' && args[0].toLowerCase() === 'all') {
      amount = getTotalBalance(userId);
      if (amount <= 0) {
        message.reply('You have no cash or bank to bet.');
        return;
      }
    } else {
      amount = parseInt(args[0], 10);
      if (isNaN(amount) || amount <= 0) {
        message.reply('Please specify a valid amount to bet.');
        return;
      }
      if (getCash(userId) < amount) {
        message.reply('Insufficient funds: Use .withdraw <amount> to withdraw from your bank.');
        return;
      }
    }

    if (amount < MIN_BET) {
      message.reply(`The minimum bet is ${formatCoins(MIN_BET)} coins.`);
      return;
    }
    if (amount > MAX_BET) {
      message.reply(`The maximum bet is ${formatCoins(MAX_BET)} coins.`);
      return;
    }

    const win = Math.random() < 0.49; // 49% chance to win, 51% to lose
    if (win) {
      addCash(userId, amount);
      message.reply(`You won! You gain ${formatCoins(amount)} cash.`);
    } else {
      addCash(userId, -amount);
      message.reply(`You lost! You lose ${formatCoins(amount)} cash.`);
    }
  }
};