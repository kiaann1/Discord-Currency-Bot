import { getCash, addCash, getTotalBalance } from '../currency.js';

const MIN_BET = 50;
const MAX_BET = 500000;

export default {
  name: 'coinflip',
  aliases: ['cf', 'flip'],
  description: 'Bet an amount on heads or tails. Usage: .coinflip <amount> <heads/tails>',
  async execute(message, args) {
    if (args.length < 2) {
      message.reply('Usage: .coinflip <amount> <heads/tails>');
      return;
    }
    let amount;
    if (typeof args[0] === 'string' && args[0].toLowerCase() === 'all') {
      amount = getTotalBalance(message.author.id);
    } else {
      amount = parseInt(args[0], 10);
    }
    const choice = args[1].toLowerCase();
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
    if (choice !== 'heads' && choice !== 'tails') {
      message.reply('Please choose either "heads" or "tails".');
      return;
    }
    const userId = message.author.id;
    if (getCash(userId) < amount) {
      message.reply(`You need at least ${amount} cash to play. Use .withdraw <amount> to get cash from your bank.`);
      return;
    }
    const result = Math.random() < 0.5 ? 'heads' : 'tails';
    if (choice === result) {
      addCash(userId, amount); // Win: get back bet + profit (total 2x)
      message.reply(`🪙 The coin landed on **${result}**! You won ${amount} cash!`);
    } else {
      addCash(userId, -amount); // Lose: lose bet
      message.reply(`🪙 The coin landed on **${result}**! You lost ${amount} cash.`);
    }
  }
};
