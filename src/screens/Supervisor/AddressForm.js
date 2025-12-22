import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, ScrollView } from 'react-native';

const AddressForm = ({ navigation, route }) => {
  // Get ship data from route params (if available)
  const shipData = route?.params?.ship || {};

  const [origin, setOrigin] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  const [destination, setDestination] = useState({
    street: '',
    city: '',
    state: '',
    postalCode: '',
    country: '',
  });

  // Pre-fill form when route data is available
  useEffect(() => {
    if (shipData.originAddress) {
      setOrigin({
        street: shipData.originAddress.street || '',
        city: shipData.originAddress.city || '',
        state: shipData.originAddress.state || '',
        postalCode: shipData.originAddress.postalCode || '',
        country: shipData.originAddress.country || '',
      });
    }

    if (shipData.destinationAddress) {
      setDestination({
        street: shipData.destinationAddress.street || '',
        city: shipData.destinationAddress.city || '',
        state: shipData.destinationAddress.state || '',
        postalCode: shipData.destinationAddress.postalCode || '',
        country: shipData.destinationAddress.country || '',
      });
    }
  }, [shipData]);

  const handleChange = (type, key, value) => {
    if (type === 'origin') {
      setOrigin((prev) => ({ ...prev, [key]: value }));
    } else {
      setDestination((prev) => ({ ...prev, [key]: value }));
    }
  };

  const handleSubmit = async () => {
    const payload = {
      originAddress: origin,
      destinationAddress: destination,
    };

    // console.log('Payload:', payload);
    // try {
    //   const response = await fetch('https://your-api-endpoint.com/api/addresses', {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(payload),
    //   });

    //   if (response.ok) {
    //     const result = await response.json();
    //     Alert.alert('Success', 'Data sent successfully!');
    //     console.log('Response:', result);
    //   } else {
    //     Alert.alert('Error', 'Failed to send data.');
    //     console.log('Error:', await response.text());
    //   }
    // } catch (error) {
    //   Alert.alert('Network Error', error.message);
    // }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Origin Address</Text>
      {Object.keys(origin).map((key) => (
        <TextInput
          key={key}
          placeholder={`Origin ${key}`}
          style={styles.input}
          value={origin[key]}
          onChangeText={(value) => handleChange('origin', key, value)}
        />
      ))}

      <Text style={styles.heading}>Destination Address</Text>
      {Object.keys(destination).map((key) => (
        <TextInput
          key={key}
          placeholder={`Destination ${key}`}
          style={styles.input}
          value={destination[key]}
          onChangeText={(value) => handleChange('destination', key, value)}
        />
      ))}

      <Button title="Submit" onPress={handleSubmit} color="#007bff" />
      <Button title="Back" onPress={() => navigation.goBack()} color="#007bff" />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:'white'
  },
  heading: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 6,
  },
});

export default AddressForm;
