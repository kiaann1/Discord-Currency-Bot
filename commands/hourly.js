import { getLastClaim, setLastClaim, addCash } from '../currency.js';

const HOURLY_AMOUNT = 500;
const HOURLY_COOLDOWN = 60 * 60 * 1000;

export default {
  name: 'hourly',
  description: 'Claim your hourly coins!',
  execute(message) {
    const userId = message.author.id;
    const now = Date.now();
    const last = getLastClaim(userId, 'hourly');
    if (now - last < HOURLY_COOLDOWN) {
      const remaining = Math.ceil((HOURLY_COOLDOWN - (now - last)) / 1000 / 60);
      message.reply(`You already claimed your hourly! Try again in ${remaining} minute(s).`);
      return;
    }
    addCash(userId, HOURLY_AMOUNT);
    setLastClaim(userId, 'hourly', now);
    message.reply(`You claimed your hourly ${HOURLY_AMOUNT} coins!`);
  }
};
