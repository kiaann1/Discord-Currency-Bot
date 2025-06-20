import fs from 'fs';

function formatCoins(n) {
  return n.toLocaleString();
}

export default {
  name: 'leaderboard',
  aliases: ['lb'],
  description: 'Show the top 10 users with the most total money (cash + bank).',
  async execute(message) {
    const data = JSON.parse(fs.readFileSync('./currency.json'));
    const leaderboard = Object.entries(data)
      .map(([userId, info]) => ({
        userId,
        total: (info.cash || 0) + (info.bank || 0)
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 10);

    if (leaderboard.length === 0) {
      message.reply('No users found on the leaderboard.');
      return;
    }

    const lines = await Promise.all(leaderboard.map(async (entry, idx) => {
      try {
        const user = await message.client.users.fetch(entry.userId);
        return `#${idx + 1}: **${user.username}** — ${formatCoins(entry.total)} coins`;
      } catch {
        return `#${idx + 1}: Unknown User (${entry.userId}) — ${formatCoins(entry.total)} coins`;
      }
    }));

    message.reply(`🏆 **Leaderboard** 🏆\n${lines.join('\n')}`);
  }
};
