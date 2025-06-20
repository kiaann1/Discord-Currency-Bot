import { withdraw, getBank } from '../currency.js';

function formatCoins(n) {
  return n.toLocaleString();
}

export default {
  name: 'withdraw',
  aliases: ['with'],
  description: 'Withdraw coins from your bank. Usage: .withdraw <amount> or .withdraw all',
  async execute(message, args) {
    const userId = message.author.id;
    let amountArg = args[0];
    let userBank = getBank(userId);

    if (!amountArg) {
      return message.reply(`Please specify a valid amount to withdraw. (You have ${formatCoins(userBank)} in bank)`);
    }

    let amount = amountArg;
    if (typeof amount === 'string') {
      amount = amount.replace(/,/g, '');
      if (amount.toLowerCase() === 'all') {
        amount = userBank;
      } else {
        amount = parseInt(amount, 10);
      }
    }

    if (isNaN(amount) || amount <= 0) {
      return message.reply(`Please specify a valid amount to withdraw. (You have ${formatCoins(userBank)} in bank)`);
    }
    if (amount > userBank) {
      return message.reply(`You don't have that much in your bank! (You have ${formatCoins(userBank)} in bank)`);
    }

    if (withdraw(userId, amount)) {
      return message.reply(`You withdrew 🪙 ${formatCoins(amount)} from your bank!`);
    } else {
      return message.reply('Withdraw failed.');
    }
  }
};