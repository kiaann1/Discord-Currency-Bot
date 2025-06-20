import { REST, Routes, SlashCommandBuilder } from 'discord.js';
import { getCash, getBank } from './currency.js';
import 'dotenv/config';

const commands = [
  new SlashCommandBuilder()
    .setName('balance')
    .setDescription('Show your cash and bank balance')
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

// Replace with your server's guild ID
const GUILD_ID = process.env.DISCORD_GUILD_ID;

export async function registerSlashCommands() {
  try {
    await rest.put(
      Routes.applicationGuildCommands(process.env.DISCORD_APP_ID, GUILD_ID),
      { body: commands }
    );
    console.log('Slash commands registered (guild scope).');
  } catch (error) {
    console.error(error);
  }
}

export async function handleSlashCommand(interaction) {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === 'balance') {
    const cash = getCash(interaction.user.id);
    const bank = getBank(interaction.user.id);
    await interaction.reply(`💵 ${cash.toLocaleString()} cash\n🏦 ${bank.toLocaleString()} in the bank`);
  }
}
