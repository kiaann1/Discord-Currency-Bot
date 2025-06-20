import { getCash, addCash } from '../currency.js';

function formatCoins(n) {
  return n.toLocaleString();
}

const MIN_GIVE = 1;

export default {
  name: 'give',
  description: 'Give another user coins from your cash. Usage: .give @user amount',
  async execute(message, args) {
    if (args.length < 2) {
      message.reply('Usage: .give @user amount');
      return;
    }

    const target = message.mentions.users.first();
    if (!target || target.id === message.author.id) {
      message.reply('Please mention a valid user to give coins to (not yourself).');
      return;
    }

    const amount = parseInt(args[1], 10);
    if (isNaN(amount) || amount < MIN_GIVE) {
      message.reply('Please specify a valid amount to give.');
      return;
    }

    const senderId = message.author.id;
    const receiverId = target.id;

    if (getCash(senderId) < amount) {
      message.reply(`You do not have enough cash to give. Your cash: ${formatCoins(getCash(senderId))}`);
      return;
    }

    addCash(senderId, -amount);
    addCash(receiverId, amount);

    message.reply(`You gave ${formatCoins(amount)} coins to ${target.username}.`);
    try {
      await target.send(`You received ${formatCoins(amount)} coins from ${message.author.username}!`);
    } catch {
      // Ignore DM errors (user may have DMs off)
    }
  }
};
