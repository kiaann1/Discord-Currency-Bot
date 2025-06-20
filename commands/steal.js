import { getCash, addCash } from '../currency.js';

function formatCoins(n) {
  return n.toLocaleString();
}

// In-memory cooldowns: { [userId]: timestamp }
const stealCooldowns = {};

const COOLDOWN = 30 * 60 * 1000; // 30 minutes in ms

export default {
  name: 'steal',
  description: 'Attempt to steal 30-70% of another user\'s cash. Usage: .steal @user (30 min cooldown)',
  async execute(message, args) {
    const MIN_CASH = 1000;
    const thiefId = message.author.id;
    const now = Date.now();

    // Cooldown check
    if (stealCooldowns[thiefId] && now - stealCooldowns[thiefId] < COOLDOWN) {
      const remaining = Math.ceil((COOLDOWN - (now - stealCooldowns[thiefId])) / 60000);
      message.reply(`You must wait ${remaining} more minute(s) before trying to steal again.`);
      return;
    }

    const target = message.mentions.users.first();
    if (!target || target.id === thiefId) {
      message.reply('Please mention a valid user to steal from (not yourself).');
      return;
    }

    if (getCash(thiefId) < MIN_CASH) {
      message.reply(`You need at least ${formatCoins(MIN_CASH)} cash to attempt a steal.`);
      return;
    }

    const victimId = target.id;
    const victimCash = getCash(victimId);

    if (victimCash < 1) {
      message.reply(`${target.username} has no cash to steal.`);
      return;
    }

    // 10% chance to succeed, 90% chance to get caught
    const success = Math.random() < 0.1;

    if (success) {
      // Weighted random: 30% (40%), 40% (30%), 50% (15%), 60% (10%), 70% (5%)
      const chances = [
        { percent: 0.7, weight: 5 },
        { percent: 0.6, weight: 10 },
        { percent: 0.5, weight: 15 },
        { percent: 0.4, weight: 30 },
        { percent: 0.3, weight: 40 }
      ];
      const totalWeight = chances.reduce((sum, c) => sum + c.weight, 0);
      let rand = Math.random() * totalWeight;
      let chosen = 0.3;
      for (const c of chances) {
        if (rand < c.weight) {
          chosen = c.percent;
          break;
        }
        rand -= c.weight;
      }

      const amount = Math.max(1, Math.floor(victimCash * chosen));
      addCash(victimId, -amount);
      addCash(thiefId, amount);

      message.reply(`You successfully stole ${formatCoins(amount)} cash (${Math.round(chosen * 100)}%) from ${target.username}!`);
      try {
        await target.send(`${message.author.username} stole ${formatCoins(amount)} cash from you!`);
      } catch {
        // Ignore DM errors
      }
    } else {
      // Caught! Pay 70-100% of your cash to the victim
      const penaltyPercent = 0.7 + Math.random() * 0.3; // 70% to 100%
      const thiefCash = getCash(thiefId);
      const penalty = Math.max(1, Math.floor(thiefCash * penaltyPercent));
      addCash(thiefId, -penalty);
      addCash(victimId, penalty);

      message.reply(`You were caught trying to steal! You must pay ${formatCoins(penalty)} cash (${Math.round(penaltyPercent * 100)}%) to ${target.username} as a penalty.`);
      try {
        await target.send(`${message.author.username} tried to steal from you and got caught! You received ${formatCoins(penalty)} cash as compensation.`);
      } catch {
        // Ignore DM errors
      }
    }

    // Set cooldown
    stealCooldowns[thiefId] = now;
  }
};
