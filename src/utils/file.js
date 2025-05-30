import { promises as fs } from 'fs';

const DATA_FILE_PATH = './data.txt';

export async function loadAllAuthTokens() {
  try {
    const fileContent = await fs.readFile(DATA_FILE_PATH, 'utf-8');
    const tokens = fileContent.split('\n').map(line => line.trim()).filter(Boolean);
    if (tokens.length === 0) {
      throw new Error('data.txt is empty.');
    }
    console.log(`Loaded ${tokens.length} accounts from data.txt.`);
    return tokens;
  } catch (error) {
    console.error('Failed to load tokens from data.txt:', error.message);
    process.exit(1);
  }
} 