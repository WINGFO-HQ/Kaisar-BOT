import axios from 'axios';
import { loadAllAuthTokens } from '../utils/file.js';

export async function claimMining(extension, token) {
  const url = 'https://zero-api.kaisar.io/mining/claim';
  const payload = { extension };

  try {
    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(
        `Claim API error: ${error.response.status} ${error.response.statusText} - ${JSON.stringify(error.response.data)}`
      );
    } else if (error.request) {
      throw new Error('No response from claim API');
    } else {
      throw new Error('Claim API error: ' + error.message);
    }
  }
}

export async function claimAllAccounts(extension) {
  const tokens = await loadAllAuthTokens();
  const results = [];
  for (const token of tokens) {
    try {
      const res = await claimMining(extension, token);
      results.push({ token, success: true, data: res });
    } catch (err) {
      results.push({ token, success: false, error: err.message });
    }
  }
  return results;
} 