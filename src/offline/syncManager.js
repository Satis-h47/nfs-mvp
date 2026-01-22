import { processPostQueue } from './postQueue';
import { processStatusQueue } from './statusQueue';
import { processPutQueue } from './putQueue';

export const syncAll = async ({ globalApi, token, setIsSyncing, setLastSyncAt }) => {
    try {
    setIsSyncing(true);
  await processPostQueue(globalApi, token);
  await processStatusQueue(globalApi, token);
  await processPutQueue(globalApi, token)  
  
  setLastSyncAt(Date.now());
  } finally {
    setIsSyncing(false);
  }
console.log("I am Here After Available Network")
};
