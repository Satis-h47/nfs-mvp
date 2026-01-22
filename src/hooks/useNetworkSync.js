import { useEffect , useRef} from 'react';
import NetInfo from '@react-native-community/netinfo';
import { useTrips } from '../context/TripContext';
import { syncAll } from '../offline/syncManager';

export const useNetworkSync = () => {
  const { globalApi, token, setIsSyncing, setLastSyncAt } = useTrips();
  const wasConnected = useRef(false);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      if (!wasConnected.current && state.isConnected && token) {
        syncAll({ globalApi, token, setIsSyncing, setLastSyncAt });
      }

      wasConnected.current = state.isConnected;
    });

    return unsubscribe;
  }, []);
};
