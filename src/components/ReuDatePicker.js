import React from 'react';
import { Platform, Modal, Pressable, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTrips } from "../context/TripContext";

const ReuDatePicker = ({
  visible,
  value,
  onChange,
  onClose,
  mode = 'date',
}) => {
    const {theme} = useTrips();
  const handleChange = (event, selectedDate) => {
    if (event?.type === 'set' && selectedDate) {
      onChange?.(selectedDate);
    }
    onClose?.();
  };

  // iOS: modal with backdrop
  if (Platform.OS === 'ios') {
    return (
      <Modal
        visible={visible}
        transparent
        animationType="fade"
      >
        {/* Backdrop */}
        <Pressable
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.7)',
            justifyContent: 'center',
            padding: 20,
          }}
          onPress={onClose}
        >
          {/* Picker container */}
          <Pressable
            style={{
              backgroundColor: theme?.colors?.card ?? '#fff',
              borderRadius: 8,
              padding: 10,
              maxHeight: '60%',
            }}
            onPress={() => {}}
          >
            <DateTimePicker
              value={value || new Date()}
              mode={mode}
              display="inline"
              onChange={handleChange}
            />
          </Pressable>
        </Pressable>
      </Modal>
    );
  }

  // Android / others
  return (
    visible && (
      <DateTimePicker
        value={value || new Date()}
        mode={mode}
        display="inline"
        onChange={handleChange}
      />
    )
  );
};

export default ReuDatePicker;
