import fs from 'fs';
import path from 'path';
import { pathToFileURL } from 'url';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbPath = path.join(__dirname, './db/bank.json');

function readUserData() {
    if (!fs.existsSync(dbPath) || !fs.readFileSync(dbPath, 'utf8').trim()) fs.writeFileSync(dbPath, '{}');
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

const commands = new Map();

const commandsPath = path.join(process.cwd(), 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(pathToFileURL(path.join(commandsPath, file)));
  commands.set(command.default.name, command.default);
  if (command.default.aliases) {
    for (const alias of command.default.aliases) {
      commands.set(alias, command.default);
    }
  }
}

function resolveAmount(userId) {
    const userData = readUserData(); // Make sure this function exists and returns the parsed bank.json
    const cash = userData[userId]?.cash ?? 0; // Define cash before using it
    return cash > 0 ? cash : undefined;
}

export function handleCommand(message) {
  if (!message.content.startsWith('.') || message.author.bot) return;
  const args = message.content.slice(1).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  if (commands.has(commandName)) {
    // For coinflip, map h/t to heads/tails before calling execute
    if (commandName === 'coinflip' || commandName === 'cf') {
      if (args[0] && args[0].toLowerCase() === 'h') args[0] = 'heads';
      if (args[0] && args[0].toLowerCase() === 't') args[0] = 'tails';
      if (args[1] && args[1].toLowerCase() === 'h') args[1] = 'heads';
      if (args[1] && args[1].toLowerCase() === 't') args[1] = 'tails';
    }
    commands.get(commandName).execute(message, args);
  }
}