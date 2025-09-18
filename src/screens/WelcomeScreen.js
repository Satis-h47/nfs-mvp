// WelcomeScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function WelcomeScreen({ navigation }) {
  const [toggle, setToggle] = useState(false);
  const [name, setName] = useState("Select User Type");
  const [list] = useState(["Supervisor", "Manager"]);

  const toggleDropdown = () => {
    setToggle((prev) => !prev);
  };

  const handleSelect = (item) => {
    setName(item);
    setToggle(false);
  };

  const proceed = () => {
    if (name === "Select User Type") {
      alert("Please select user type");
      return;
    }
    navigation.navigate("Login");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>NFS</Text>

      <View style={{ width: "100%" }}>
        {/* Dropdown button */}
        <TouchableOpacity
          onPress={toggleDropdown}
          style={styles.dropdownButton}
        >
          <Text style={styles.dropdownText}>{name}</Text>
          <Text style={styles.arrow}>▼</Text>
        </TouchableOpacity>

        {/* Dropdown list */}
        {toggle && (
          <View style={styles.dropdownList}>
            {list.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(item)}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={proceed}>
        <Text style={styles.buttonText}>Proceed</Text>
      </TouchableOpacity>

      <Text style={styles.helpText}>Need help? Contact IT Support</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    fontSize: 40,
    color: "#fff",
    marginBottom: 40,
    fontWeight: "bold",
  },
  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    marginBottom: 10,
  },
  dropdownText: {
    color: "#fff",
    fontSize: 16,
  },
  arrow: {
    color: "#ff9800",
    fontSize: 14,
    marginLeft: 10,
  },
  dropdownList: {
    position:'absolute',
    width:'100%',
    zIndex:1,
    top:'100%',
    backgroundColor: "#1c1c1c",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    marginTop: 5,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  dropdownItemText: {
    color: "#fff",
    fontSize: 16,
  },
  button: {
    width: "100%",
    backgroundColor: "#ff9800",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  helpText: {
    color: "#aaa",
    marginTop: 30,
    fontSize: 12,
  },
});
