import { getLastClaim, setLastClaim, addCash } from '../currency.js';

const DAILY_AMOUNT = 2500;
const DAILY_COOLDOWN = 24 * 60 * 60 * 1000;

export default {
  name: 'daily',
  description: 'Claim your daily coins!',
  execute(message) {
    const userId = message.author.id;
    const now = Date.now();
    const last = getLastClaim(userId, 'daily');
    if (now - last < DAILY_COOLDOWN) {
      const remaining = Math.ceil((DAILY_COOLDOWN - (now - last)) / 1000 / 60 / 60);
      message.reply(`You already claimed your daily! Try again in ${remaining} hour(s).`);
      return;
    }
    addCash(userId, DAILY_AMOUNT);
    setLastClaim(userId, 'daily', now);
    message.reply(`You claimed your daily ${DAILY_AMOUNT} coins!`);
  }
};
