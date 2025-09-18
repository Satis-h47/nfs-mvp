// DashboardScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground, Dimensions
} from "react-native";
const { width, height } = Dimensions.get('window');
export default function DashboardScreen({navigation}) {
  const [modules, setModules] = useState([]);
  const [userName, setUserName] = useState("Nelson Mandela"); // simulate API user

  // Simulate API call for dashboard data
  useEffect(() => {
    const fetchData = async () => {
const data = [
  { id: "1", title: "Mine1", icon: "https://img.icons8.com/ios/100/000000/mine-cart.png" },
  { id: "2", title: "Mine2", icon: "https://img.icons8.com/ios/100/000000/mine-cart.png" },
  { id: "3", title: "Yard1", icon: "https://img.icons8.com/ios/100/000000/container-truck.png" },
  { id: "4", title: "Yard2", icon: "https://img.icons8.com/ios/100/000000/container-truck.png" },
];

      setModules(data);
    };
    fetchData();
  }, []);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.icon }} style={styles.icon} />
      <Text style={styles.title}>{item.title}</Text>
      <TouchableOpacity style={styles.viewButton} onPress={() => navigation.navigate("TripDetails", {source: item.title})}>
        <Text style={styles.viewButtonText}>VIEW</Text>
      </TouchableOpacity>
    </View>
  );

  return (
                <ImageBackground 
          source={require('../../assets/images/rawBG.jpg')} // Path to your image
          style={{ width, height }}
          resizeMode="cover"
        >
    <View style={styles.container}>
      {/* 🔥 Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>

      {/* Grid */}
      <FlatList
        data={modules}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#000", // dark theme
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
  },
  header: {
    marginTop: 25,
    marginBottom: 25,
    paddingVertical: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: "#aaa",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ff9800", // orange highlight
    marginTop: 2,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    flex: 1,
    marginHorizontal: 5,
    elevation: 4,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  icon: {
    width: 50,
    height: 50,
    tintColor: "#ff9800",
    marginBottom: 15,
  },
  title: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
  },
  viewButton: {
    backgroundColor: "#ff9800",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
