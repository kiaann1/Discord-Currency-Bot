import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dbDir = path.join(__dirname, '../db');
const dbPath = path.join(dbDir, 'bank.json');

function readBankData() {
    if (!fs.existsSync(dbDir)) fs.mkdirSync(dbDir, { recursive: true });
    if (!fs.existsSync(dbPath) || !fs.readFileSync(dbPath, 'utf8').trim()) fs.writeFileSync(dbPath, '{}');
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}
function writeBankData(bank) {
    fs.writeFileSync(dbPath, JSON.stringify(bank, null, 2));
}

export default {
    async execute(message, args) {
        // Debug: Show args if needed
        // await message.reply(`DEBUG: args = ${JSON.stringify(args)}`);
        const bank = readBankData();
        const userId = message.author.id;
        if (!bank[userId]) {
            bank[userId] = { cash: 0, bank: 0 };
        }
        let userCash = bank[userId].cash;
        let amountArg = args[0];
        let amount;

        if (!amountArg) {
            return message.reply('Please specify an amount to deposit, or "all" to deposit all your cash.');
        }

        if (amountArg.toLowerCase() === 'all') {
            if (userCash <= 0) {
                return message.reply('You have no cash to deposit!');
            }
            amount = userCash;
        } else {
            amount = parseInt(amountArg.replace(/,/g, ''), 10);
            if (isNaN(amount) || amount <= 0) {
                return message.reply('Please specify a valid amount to deposit.');
            }
            if (amount > userCash) {
                return message.reply(`You don't have that much cash! (You have ${userCash} cash)`);
            }
        }

        bank[userId].cash -= amount;
        bank[userId].bank += amount;
        writeBankData(bank);

        return message.reply(`You deposited 💳 ${amount.toLocaleString()} into your bank!`);
    }
};
