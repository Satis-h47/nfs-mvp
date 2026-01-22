import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { useTrips } from '../context/TripContext';

export const SyncLoader = () => {
  const { isSyncing } = useTrips();

  if (!isSyncing) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#fff" />
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent:'center',
    zIndex: 999,
  },
});
