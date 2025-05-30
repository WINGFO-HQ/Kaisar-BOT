import axios from 'axios';

const EXTENSION_ID = '00827387-7b4f-4a78-ab36-f120cdab3dbc';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36';
const ORIGIN_CHROME_EXTENSION = 'chrome-extension://lmmffmdcfffkfjgidegbfgnoomomnipb';
const API_BASE_URL = 'https://zero-api.kaisar.io';
const MINING_START_URL = `${API_BASE_URL}/mining/start`;
const MINING_CURRENT_URL = `${API_BASE_URL}/mining/current`;
const MINING_POINTS_URL = `${API_BASE_URL}/extension/mining-point`;

export function getBaseHeaders(token) {
  if (!token) throw new Error('Auth token not loaded.');
  return {
    'Authorization': `Bearer ${token}`,
    'User-Agent': USER_AGENT,
    'Accept': 'application/json, text/plain, */*',
  };
}

export async function startMining(token) {
  try {
    const headers = getBaseHeaders(token);
    headers['Content-Type'] = 'application/json';
    headers['Origin'] = ORIGIN_CHROME_EXTENSION;
    const payload = { extension: EXTENSION_ID };
    const response = await axios.post(MINING_START_URL, payload, { headers });
    return response.data && response.data.data ? response.data.data : null;
  } catch {
    return null;
  }
}

export async function getCurrentMiningStatus(token) {
  try {
    const headers = getBaseHeaders(token);
    const params = { extension: EXTENSION_ID };
    const response = await axios.get(MINING_CURRENT_URL, { headers, params });
    if (response.data && response.data.data) return response.data.data;
    if (response.data && response.data.data === null) return null;
    return { error: 'Invalid /mining/current response format' };
  } catch (error) {
    return { error: error.message };
  }
}

export async function getMiningPoints(token) {
  try {
    const headers = getBaseHeaders(token);
    const response = await axios.get(MINING_POINTS_URL, { headers });
    if (response.data && response.data.data) return response.data.data;
    return { score: 'N/A', boost: 'N/A', point: 'N/A' };
  } catch {
    return { score: 'Error', boost: 'Error', point: 'Error' };
  }
} 