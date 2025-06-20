import { addCash } from '../currency.js';
import { sessions } from './higherlower.js';

function formatCoins(n) {
  return n.toLocaleString();
}

export default {
  name: 'low',
  description: 'Guess low in your current higher or lower game.',
  execute(message) {
    const userId = message.author.id;
    if (!sessions[userId]) {
      message.reply('You do not have an active higher or lower game. Start one with .hl <amount>');
      return;
    }
    const session = sessions[userId];
    const next = Math.floor(Math.random() * 10) + 1; // 1-10
    let resultMsg = `Next number is **${next}**. `;

    // Only compare numbers, no random win chance
    const isCorrect = next < session.current;

    if (isCorrect) {
      session.streak += 1;
      const gain = Math.floor(session.bet * 0.10);
      session.profit += gain;
      session.current = next;
      resultMsg += `Correct! Streak: ${session.streak}. Profit so far: ${formatCoins(session.profit)}. Type .high or .low to continue, or .ff to end the game and take your winnings.`;
    } else {
      const loss = Math.floor(session.bet * 0.15);
      session.profit -= loss;
      addCash(userId, session.profit);
      delete sessions[userId];
      resultMsg = `Wrong! The next number was ${next}. Game over. Your result is ${session.profit >= 0 ? `+${formatCoins(session.profit)}` : formatCoins(session.profit)} coins.`;
    }
    message.reply(resultMsg);
  }
};
