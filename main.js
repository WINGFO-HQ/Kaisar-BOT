import { runMultiAccountAutomation } from './src/core/automation.js';

runMultiAccountAutomation().catch(err => {
  console.error('Fatal error in multi-account automation:', err);
});