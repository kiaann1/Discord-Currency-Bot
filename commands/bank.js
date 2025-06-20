import { getCash, getBank } from '../currency.js';

function formatCoins(n) {
  return n.toLocaleString();
}

export default {
  name: 'bank',
  description: 'Show your cash and bank balances. Usage: .bal [@user]',
  aliases: ['bal'],
  async execute(message) {
    const target = message.mentions.users.first() || message.author;
    const cash = getCash(target.id);
    const bank = getBank(target.id);
    if (target.id === message.author.id) {
      message.reply(`You have 🪙 ${formatCoins(cash)} cash and 💳 ${formatCoins(bank)} in the bank.`);
    } else {
      message.reply(`${target.username} has 🪙 ${formatCoins(cash)} cash and 💳 ${formatCoins(bank)} in the bank.`);
    }
  }
};
