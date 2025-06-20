import { deposit, getCash } from '../currency.js';

function formatCoins(n) {
  return n.toLocaleString();
}

export default {
  name: 'deposit',
  description: 'Deposit cash into your bank. Usage: .deposit <amount> or .deposit all',
  aliases: ['dep'],
  execute(message, args) {
    const userId = message.author.id;
    let amount;

    if (!args[0]) {
      message.reply('Please specify an amount to deposit, or "all" to deposit all your cash.');
      return;
    }

    if (args[0].toLowerCase() === 'all') {
      amount = getCash(userId);
      if (amount <= 0) {
        message.reply('You have no cash to deposit.');
        return;
      }
    } else {
      amount = parseInt(args[0].replace(/,/g, ''), 10);
      if (isNaN(amount) || amount <= 0) {
        message.reply('Please specify a valid amount to deposit.');
        return;
      }
      if (getCash(userId) < amount) {
        message.reply(`You do not have enough cash to deposit. Your cash: ${formatCoins(getCash(userId))}`);
        return;
      }
    }

    if (deposit(userId, amount)) {
      message.reply(`Deposited ${formatCoins(amount)} cash into your bank.`);
    } else {
      message.reply('Deposit failed.');
    }
  }
};