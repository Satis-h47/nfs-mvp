// TripDetailsScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { useTrips } from '../../context/TripContext';

const TripModal = ({ navigation, route }) => {
  const { user, updateTrip } = useTrips();
  const { trip } = route.params || {}; // Get trip data passed from form

  return (
    <View style={styles.container}>
      <ScrollView>
        <Text style={styles.title}>Trip Details</Text>

        {trip ? (
          Object.entries(trip).map(([key, value]) => {
            if(key === 'id'){
              return
            }
  if (key === 'photoEmpty' || key === 'photoLoaded') {
    return (
      <View key={key} style={styles.detailRow}>
        <Text style={styles.label}>{key}</Text>
        {value ? (
          <Image source={{ uri: value }} style={styles.image} />
        ) : (
          <Text style={styles.value}>N/A</Text>
        )}
      </View>
    );
  }

  return (
    <View key={key} style={styles.detailRow}>
      <Text style={styles.label}>{key}</Text>
      <Text style={styles.value}>{value ?? 'N/A'}</Text>
    </View>
  );
})
        ) : (
          <Text style={styles.noData}>No trip data available</Text>
        )}
        {
          user == "Supervisor" &&
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>Back</Text>
        </TouchableOpacity>
        }
        {
        user == "Manager" &&
        <View style={{flexDirection:'row'}}>
        <TouchableOpacity
          onPress={() => {
            updateTrip(trip.id, { action: "Approved" })
          navigation.goBack()
          }}
          style={styles.closeButton}
        >
          <Text style={[styles.closeButtonText, {color:'green'}]}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // console.log(trip.id,"dsa")
            updateTrip(trip.id, { action: "Rejected" })
          navigation.goBack()
          }}
          style={styles.closeButton}
        >
          <Text style={[styles.closeButtonText, {color:'red'}]}>Reject</Text>
        </TouchableOpacity>
        </View>
        }
      </ScrollView>
    </View>
  );
};

export default TripModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  detailRow: {
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: 16,
  },
  value: {
    color: '#444',
    fontSize: 15,
    marginTop: 2,
  },
  noData: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 16,
  },
  closeButton: {
    flex:1,
    marginTop: 25,
    backgroundColor: '#ff9800',
    padding: 12,
    borderRadius: 8,
    // alignSelf: 'center',
    // width: '50%',
    margin:5
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  image: {
  width: 100,
  height: 100,
  resizeMode: 'cover',
  marginTop: 5,
}
});
