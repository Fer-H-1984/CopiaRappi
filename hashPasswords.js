import * as bcrypt from 'bcryptjs';

const passwords = ['admin123', 'user123', 'driver123', 'vendor123'];
const saltRounds = 10;

async function generateHashes() {
  for (const pw of passwords) {
    const hash = await bcrypt.hash(pw, saltRounds);
    console.log(`Password: ${pw} => Hash: ${hash}`);
  }
}

generateHashes();
