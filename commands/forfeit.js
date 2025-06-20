import { addCash } from '../currency.js';
import { sessions } from './higherlower.js';

export default {
  name: 'forfeit',
  aliases: ['ff'],
  description: 'Forfeit your current higher or lower game and take your winnings or losses.',
  execute(message) {
    const userId = message.author.id;
    if (!sessions[userId]) {
      message.reply('You do not have an active higher or lower game.');
      return;
    }
    const session = sessions[userId];
    addCash(userId, session.profit);
    const result = session.profit >= 0 ? `You win ${session.profit} coins.` : `You lost ${-session.profit} coins.`;
    delete sessions[userId];
    message.reply(`You forfeited the game. ${result}`);
  }
};
