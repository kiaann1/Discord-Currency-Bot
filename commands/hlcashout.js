import { addCash } from '../currency.js';
import sessions from './higherlower.js';

export default {
  name: 'hlcashout',
  description: 'Cash out your winnings from higher or lower.',
  execute(message) {
    const userId = message.author.id;
    if (!sessions[userId]) {
      message.reply('You do not have an active higher or lower game.');
      return;
    }
    const session = sessions[userId];
    const profit = session.bet === 500000 ? session.streak * 10000 : 100 + session.streak * 100;
    addCash(userId, profit);
    delete sessions[userId];
    message.reply(`You cashed out and won ${profit} coins!`);
  }
};
