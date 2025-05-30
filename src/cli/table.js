import { Table } from 'console-table-printer';

function centerText(text) {
  const width = process.stdout.columns || 80;
  const pad = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(pad) + text;
}

export function printMultiAccountTable(statusList) {
  console.log('\n' + centerText('=== KAISAR MINING BOT ==='));
  console.log(centerText('https://t.me/infomindao'));
  const table = new Table({ columns: [
    { name: 'Account', alignment: 'left', maxLen: 8 },
    { name: 'UID', alignment: 'left', maxLen: 24 },
    { name: 'Mining Status', alignment: 'left', maxLen: 14 },
    { name: 'Session End', alignment: 'left', maxLen: 22 },
    { name: 'Time Left', alignment: 'left', maxLen: 14 },
    { name: 'Point', alignment: 'left', maxLen: 8 },
    { name: 'Score', alignment: 'left', maxLen: 8 },
    { name: 'Boost', alignment: 'left', maxLen: 8 },
    { name: 'Last Message', alignment: 'left', maxLen: 30 },
    { name: 'Next Check', alignment: 'left', maxLen: 14 }
  ] });
  table.addRows(statusList);
  table.printTable();
} 