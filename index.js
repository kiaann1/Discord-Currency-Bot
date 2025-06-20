import { Client, GatewayIntentBits } from 'discord.js';
import 'dotenv/config';
import { handleCommand } from './commandHandler.js';
import { registerSlashCommands, handleSlashCommand } from './slash.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
  registerSlashCommands();
});

client.on('messageCreate', message => {
  handleCommand(message);
});

client.on('interactionCreate', async interaction => {
  await handleSlashCommand(interaction);
});

client.on('guildMemberAdd', member => {
  const fs = require('fs');
  const path = require('path');
  const dataPath = path.join(process.cwd(), 'userdata.json');
  let userData = {};
  if (fs.existsSync(dataPath)) {
    userData = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  }
  if (!userData[member.id]) {
    userData[member.id] = { cash: 0, bank: 0 };
    fs.writeFileSync(dataPath, JSON.stringify(userData, null, 2));
  }
});

client.login(process.env.DISCORD_TOKEN);
