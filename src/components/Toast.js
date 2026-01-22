// Toast.js
import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function Toast({
  visible,
  message,
  duration = 3000,
  onHide,
  type = 'success', // success | error | info
}) {
  const translateY = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(translateY, {
        toValue: 50,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => onHide && onHide());
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.toast,
        styles[type],
        { transform: [{ translateY }] },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    width: width * 0.9,
    padding: 14,
    borderRadius: 8,
    zIndex: 1000,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '600',
  },
  success: {
    backgroundColor: '#2ecc71',
  },
  error: {
    backgroundColor: '#e74c3c',
  },
  info: {
    backgroundColor: '#3498db',
  },
});
