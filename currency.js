import fs from 'fs';

const file = './currency.json';
let data = {};

function load() {
  if (!fs.existsSync(file)) fs.writeFileSync(file, '{}', { encoding: 'utf8' });
  data = JSON.parse(fs.readFileSync(file, { encoding: 'utf8' }));
}
function save() {
  fs.writeFileSync(file, JSON.stringify(data, null, 2), { encoding: 'utf8' });
}

// Load data once at startup
load();

function ensureUser(userId) {
  if (!data[userId]) data[userId] = { cash: 0, bank: 0 };
  if (typeof data[userId].cash !== 'number') data[userId].cash = 0;
  if (typeof data[userId].bank !== 'number') data[userId].bank = 0;
}

export function getCash(userId) {
  ensureUser(userId);
  return data[userId].cash;
}

export function getBank(userId) {
  ensureUser(userId);
  return data[userId].bank;
}

export function getTotalBalance(userId) {
  ensureUser(userId);
  return data[userId].cash + data[userId].bank;
}

export function addCash(userId, amount) {
  ensureUser(userId);
  data[userId].cash += amount;
  save();
}

export function addBank(userId, amount) {
  ensureUser(userId);
  data[userId].bank += amount;
  save();
}

export function deposit(userId, amount) {
  ensureUser(userId);
  if (data[userId].cash < amount) return false;
  data[userId].cash -= amount;
  data[userId].bank += amount;
  save();
  return true;
}

export function withdraw(userId, amount) {
  ensureUser(userId);
  if (data[userId].bank < amount) return false;
  data[userId].bank -= amount;
  data[userId].cash += amount;
  save();
  return true;
}

export function getLastClaim(userId, type) {
  ensureUser(userId);
  return data[userId][type] || 0;
}

export function setLastClaim(userId, type, timestamp) {
  ensureUser(userId);
  data[userId][type] = timestamp;
  save();
}
