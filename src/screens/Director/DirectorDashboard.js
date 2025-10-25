import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  StyleSheet,
} from "react-native";
import GoBack from "../../components/GoBack";

const DirectorDashboard = ({ navigation, route }) => {
  // ✅ Sample dashboard cards
  const dashboardData = [
    {
      id: "1",
      title: "Total Shipments",
      value: "3,500",
      kpi: "30 KPI",
      icon: "https://img.icons8.com/ios/100/ffffff/truck.png",
    },
    {
      id: "2",
      title: "Current Revenue",
      value: "3250",
      kpi: "20 KPI",
      icon: "https://img.icons8.com/ios/100/ffffff/money-bag.png",
    },
    {
      id: "3",
      title: "Stock Available",
      value: "1500",
      kpi: "36 KPI",
      icon: "https://img.icons8.com/ios/100/ffffff/warehouse.png",
    },
    {
      id: "4",
      title: "Vendors",
      value: "85",
      kpi: "12 KPI",
      icon: "https://img.icons8.com/ios/100/ffffff/conference-call.png",
    },
  ];

  // ✅ Sample trip data
  const trips = [
    { id: "1", name: "Material Shipment Report" },
    { id: "2", name: "Mine Performance Report" },
    { id: "3", name: "Stock Availability Report" },
    { id: "4", name: "Shipment by Vendor Report" },
  ];

  const renderCard = ({ item }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.icon }} style={styles.icon} />
      <Text style={styles.cardTitle}>{item.title}</Text>
      <Text style={styles.cardValue}>{item.value}</Text>
      <Text style={styles.cardKpi}>{item.kpi}</Text>
    </View>
  );

  const renderTripCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("DetailedShipmentReport")}
      style={styles.tripCard}
    >
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{
            uri: "https://img.icons8.com/ios/100/ffffff/container-truck.png",
          }}
          style={styles.tripIcon}
        />
        <Text style={styles.tripText}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row'}}>
      <GoBack navigation={navigation} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.userName}>M Satish Kumar</Text>
      </View>
</View>
      {/* Dashboard Cards */}
      <FlatList
        data={dashboardData}
        keyExtractor={(item) => item.id}
        renderItem={renderCard}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {/* Trips */}
      <FlatList
        data={trips}
        keyExtractor={(item) => item.id}
        renderItem={renderTripCard}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={{
              uri: "https://img.icons8.com/ios/100/ffffff/home.png",
            }}
            style={styles.navIcon}
          />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.plusButton}
        >
          {/* <Text style={styles.plusText}>+</Text> */}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={{
              uri: "https://img.icons8.com/ios/100/ffffff/worker-male.png",
            }}
            style={styles.navIcon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#121212",
    padding: 15,
  },
  header: {
    marginVertical:25,
    paddingVertical: 10,
    // alignItems:'center',
  },
  welcomeText: {
    fontSize: 16,
    color: "#aaa",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ff9800",
    marginTop: 2,
  },
  card: {
    backgroundColor: "#2A2A2A",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 5,
  },
  icon: {
    width: 28,
    height: 28,
    marginBottom: 10,
    tintColor: "#ff9800",
  },
  cardTitle: {
    color: "#aaa",
    fontSize: 12,
  },
  cardValue: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 4,
  },
  cardKpi: {
    color: "#aaa",
    fontSize: 12,
  },
  tripCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2A2A2A",
    padding: 16,
    marginVertical: 6,
    borderRadius: 12,
  },
  tripIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
    tintColor: "white",
  },
  tripText: {
    color: "white",
    fontSize: 16,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 40,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#1E1E1E",
    paddingVertical: 10,
  },
  navIcon: {
    width: 20,
    height: 20,
    tintColor: "white",
  },
  plusButton: {
    backgroundColor: "transparent",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    // justifyContent: "center",
    bottom: 15,
  },
  plusText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
  },
});

export default DirectorDashboard;
