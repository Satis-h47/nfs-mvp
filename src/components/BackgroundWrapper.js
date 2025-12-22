// components/BackgroundWrapper.js
import React from 'react';
import { ImageBackground, Dimensions, StyleSheet, View } from 'react-native';
import { useTrips } from '../context/TripContext';

const { width, height } = Dimensions.get('window');

const BackgroundWrapper = ({ children }) => {
  const {theme} = useTrips();
  return (
    <ImageBackground
      source={require('../assets/images/rawBG.jpg')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Overlay */}
      <View style={[styles.overlay,{backgroundColor: theme.dark ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.2)'}]} />

      {/* Actual screen content */}
      <View style={styles.content}>
        {children}
      </View>
    </ImageBackground>
)};

const styles = StyleSheet.create({
  background: {
    width,
    height,
    flex: 1
  },
  overlay: {
    ...StyleSheet.absoluteFillObject, // fills the entire ImageBackground
    // backgroundColor: 'rgba(0, 0, 0, 0.5)', // dark overlay
  },
  content: {
    flex: 1,
  }
});

export default BackgroundWrapper;