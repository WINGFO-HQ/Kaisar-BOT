import { loadAllAuthTokens } from '../utils/file.js';
import { startMining, getCurrentMiningStatus, getMiningPoints } from '../services/miningApi.js';
import { printMultiAccountTable } from '../cli/table.js';

export async function runMultiAccountAutomation() {
  const tokens = await loadAllAuthTokens();
  const statusList = tokens.map(() => ({
    Account: '-',
    UID: '-',
    'Mining Status': 'Checking...',
    'Session End': 'N/A',
    'Time Left': 'N/A',
    Point: 'Loading...',
    Score: 'Loading...',
    Boost: 'Loading...',
    'Last Message': '-',
    'Next Check': '-'
  }));
  const delays = tokens.map(() => 3000);
  const nextCheckTimestamps = tokens.map(() => Date.now() + 3000);
  const sessionEndTimestamps = tokens.map(() => null);

  async function updateStatus(idx) {
    const token = tokens[idx];
    let nextCheckDelayMs = delays[idx];
    while (true) {
      const pointsData = await getMiningPoints(token);
      const currentStatus = await getCurrentMiningStatus(token);
      statusList[idx].Account = `#${idx + 1}`;
      statusList[idx].UID = (currentStatus && currentStatus.uid) ? currentStatus.uid : '-';
      statusList[idx].Point = pointsData.point !== undefined ? pointsData.point : 'N/A';
      statusList[idx].Score = pointsData.score !== undefined ? pointsData.score : 'N/A';
      statusList[idx].Boost = pointsData.boost !== undefined ? pointsData.boost : 'N/A';
      if (currentStatus && !currentStatus.error && currentStatus.status === 1 && currentStatus.ended === 0) {
        const endTime = currentStatus.end;
        const currentTime = Date.now();
        const timeLeftMs = endTime - currentTime;
        sessionEndTimestamps[idx] = endTime;
        statusList[idx]['Mining Status'] = 'Active';
        statusList[idx]['Session End'] = new Date(endTime).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'medium' });
        if (timeLeftMs > 0) {
          const checkBeforeEndMs = 5 * 60 * 1000;
          const hourlyCheckMs = 60 * 60 * 1000;
          let delay = Math.min(timeLeftMs - checkBeforeEndMs, hourlyCheckMs);
          if (delay <= 0) {
            delay = Math.max(Math.min(timeLeftMs - (1 * 60 * 1000), 5 * 60 * 1000), 60 * 1000);
          }
          nextCheckDelayMs = Math.max(delay, 60 * 1000);
          nextCheckTimestamps[idx] = Date.now() + nextCheckDelayMs;
          statusList[idx]['Last Message'] = 'Session running normally.';
        } else {
          statusList[idx]['Mining Status'] = 'Session Ended';
          statusList[idx]['Time Left'] = 'Expired';
          statusList[idx]['Last Message'] = 'Session time expired. Restarting...';
          const newSession = await startMining(token);
          if (newSession && newSession.end) {
            const newEndTime = newSession.end;
            sessionEndTimestamps[idx] = newEndTime;
            statusList[idx]['Mining Status'] = 'Just Started';
            statusList[idx]['Session End'] = new Date(newEndTime).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'medium' });
            statusList[idx]['Last Message'] = 'New session started.';
            nextCheckDelayMs = Math.max(newEndTime - Date.now() - (5 * 60 * 1000), 60 * 1000);
            nextCheckTimestamps[idx] = Date.now() + nextCheckDelayMs;
          } else {
            statusList[idx]['Mining Status'] = 'Restart Failed';
            statusList[idx]['Last Message'] = 'Failed to start new session.';
            nextCheckDelayMs = 5 * 60 * 1000;
            nextCheckTimestamps[idx] = Date.now() + nextCheckDelayMs;
          }
        }
      } else {
        if (currentStatus && currentStatus.error) {
          statusList[idx]['Mining Status'] = 'Status Error';
          statusList[idx]['Last Message'] = `Error: ${currentStatus.error}. Trying to restart...`;
        } else {
          statusList[idx]['Mining Status'] = 'Inactive';
          statusList[idx]['Last Message'] = 'No active session or ended. Restarting...';
        }
        const newSession = await startMining(token);
        if (newSession && newSession.end) {
          const newEndTime = newSession.end;
          sessionEndTimestamps[idx] = newEndTime;
          statusList[idx]['Mining Status'] = 'Just Started';
          statusList[idx]['Session End'] = new Date(newEndTime).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'medium' });
          statusList[idx]['Last Message'] = 'New session started.';
          nextCheckDelayMs = Math.max(newEndTime - Date.now() - (5 * 60 * 1000), 60 * 1000);
          nextCheckTimestamps[idx] = Date.now() + nextCheckDelayMs;
        } else {
          statusList[idx]['Mining Status'] = 'Start Failed';
          statusList[idx]['Last Message'] = 'Failed to start new session.';
          nextCheckDelayMs = 5 * 60 * 1000;
          nextCheckTimestamps[idx] = Date.now() + nextCheckDelayMs;
        }
      }
      await new Promise(resolve => setTimeout(resolve, nextCheckDelayMs));
    }
  }

  setInterval(() => {
    for (let idx = 0; idx < tokens.length; idx++) {
      if (sessionEndTimestamps[idx]) {
        const msLeft = sessionEndTimestamps[idx] - Date.now();
        if (msLeft > 0) {
          const hours = Math.floor(msLeft / (1000 * 60 * 60));
          const minutes = Math.floor((msLeft % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((msLeft % (1000 * 60)) / 1000);
          statusList[idx]['Time Left'] = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          statusList[idx]['Time Left'] = 'Expired';
        }
      } else {
        statusList[idx]['Time Left'] = 'N/A';
      }
      const msToNext = nextCheckTimestamps[idx] - Date.now();
      if (msToNext > 0) {
        const totalSec = Math.floor(msToNext / 1000);
        const min = Math.floor(totalSec / 60);
        const sec = totalSec % 60;
        let nextStr = '';
        if (min > 0) nextStr += `${min}m `;
        nextStr += `${sec}s`;
        statusList[idx]['Next Check'] = nextStr.trim();
      } else {
        statusList[idx]['Next Check'] = '0s';
      }
    }
    console.clear();
    printMultiAccountTable(statusList);
  }, 1000);

  tokens.forEach((_, idx) => { updateStatus(idx); });
} 