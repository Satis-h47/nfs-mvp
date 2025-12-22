import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from "react-native";

const Dropdown = ({
  data = [],
  labelField = "label",
  valueField = "value",
  disable = "disable",
  placeholder = "Select an option",
  keyValue,
  onChange,
  disabled = false,

  // 👇 Style overrides
  containerStyle,
  dropdownStyle,
  placeholderStyle,
  selectedTextStyle,
  optionStyle,
  optionTextStyle,
  selectedOptionStyle,
  modalOverlayStyle,
  modalContainerStyle,
  arrowStyle,
}) => {
  const [visible, setVisible] = useState(false);
  const [dropdownLayout, setDropdownLayout] = useState(null);
  const [shouldRenderAbove, setShouldRenderAbove] = useState(false);
  const [maxDropdownHeight, setMaxDropdownHeight] = useState(0); // New state for maximum dropdown height
  const dropdownRef = useRef(null);

  const handleSelect = (item) => {
    onChange(item); // Send the entire item, not just item[valueField]
    setVisible(false);
  };

  // Adjusted logic for finding selected item based on valueField and keyValue (the selected value)
  const selectedItem = data.find((item) => item[valueField] === keyValue) || {};
  const selectedLabel = selectedItem[labelField] || placeholder;

  const openDropdown = () => {
    dropdownRef.current?.measureInWindow((x, y, width, height) => {
      setDropdownLayout({ x, y, width, height });

      // Check if the dropdown can fit below or needs to be placed above
      const screenHeight = Dimensions.get("window").height;
      const spaceBelow = screenHeight - (y + height);
      const spaceAbove = y;

      // Calculate the dropdown height based on number of items
      const listHeight = data.length * 50; // Approximate height for each item (you can adjust based on your design)
      
      // Set maximum height for dropdown to fit within available space (60% of the screen height)
      const availableHeight = spaceBelow > spaceAbove ? spaceBelow : spaceAbove;
      const maxHeight = listHeight > 200 ? 200 : listHeight; // Restrict to max 200px height

      setMaxDropdownHeight(maxHeight);

      // If there isn't enough space below, render above. Make sure space above is enough.
      if (spaceBelow < maxHeight) {
        setShouldRenderAbove(true);
      } else {
        setShouldRenderAbove(false);
      }

      setVisible(true);
    });
  };

  useEffect(() => {
    if (visible && dropdownLayout) {
      openDropdown();
    }
  }, [visible]);

  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity
        disabled={disabled}
        ref={dropdownRef}
        style={[
          styles.dropdown,
          disabled && styles.disabled,
          dropdownStyle,
        ]}
        onPress={openDropdown}
      >
        <Text
          style={
            keyValue
              ? [styles.text, selectedTextStyle]
              : [styles.placeholder, placeholderStyle]
          }
        >
          {selectedLabel}
        </Text>
        <Text style={[styles.arrow, arrowStyle]}>▼</Text>
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={[styles.modalOverlay, modalOverlayStyle]}
          activeOpacity={1}
          onPressOut={() => setVisible(false)}
        >
          {dropdownLayout && (
            <View
              style={[
                styles.modalContainer,
                modalContainerStyle,
                {
                  position: "absolute",
                  top: shouldRenderAbove
                    ? dropdownLayout.y - maxDropdownHeight-60 // Prevent too far up
                    : dropdownLayout.y + dropdownLayout.height,
                  left: dropdownLayout.x,
                  width: dropdownLayout.width,
                },
              ]}
            >
              <FlatList
                data={data}
                keyExtractor={(item) => item[valueField].toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    disabled={item[disable]}
                    style={[
                      styles.option,
                      optionStyle,
                      item[valueField] === keyValue && [
                        styles.selectedOption,
                        selectedOptionStyle,
                      ],
                      item[disable] && styles.disable,
                    ]}
                    onPress={() => handleSelect(item)}
                  >
                    <Text
                      style={[
                        styles.optionText,
                        optionTextStyle,
                        item[valueField] === keyValue && styles.selectedText,
                      ]}
                    >
                      {item[labelField]}
                    </Text>
                  </TouchableOpacity>
                )}
                // Enable scrolling and limit max height for the list
                style={{ maxHeight: maxDropdownHeight }}
                scrollEnabled={true}
              />
            </View>
          )}
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default Dropdown;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#fff",
  },
  text: {
    color: "#000",
    fontSize: 16,
  },
  placeholder: {
    color: "#999",
    fontSize: 16,
  },
  arrow: {
    color: "#000",
  },
  disabled: {
    opacity: 0.6,
  },
  disable: {
    opacity: 0.6,
    backgroundColor: "grey",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  selectedOption: {
    backgroundColor: "#f0f0f0",
  },
  optionText: {
    color: "#000",
    fontSize: 16,
  },
  selectedText: {
    fontWeight: "bold",
  },
});
