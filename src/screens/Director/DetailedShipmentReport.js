import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import GoBack from "../../components/GoBack";

  const shipments = [
    { id: "1", name: "Adilpmed", date: "10,39", status: "In Transit" },
    { id: "2", name: "Cape Tond", date: "2020", status: "In Transit" },
    { id: "3", name: "Shipment", date: "20,16", status: "Delivered" },
    { id: "4", name: "Aurgraseed", date: "10,18", status: "Pending" },
    { id: "5", name: "Sttage", date: "1039", status: "Delivered" },
    { id: "6", name: "Masep Sliod", date: "20,51", status: "Delivered" },
  ];
  
const DetailedShipmentReport = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState("All Shipments");

  const filters = ["All Shipments", "In Transit", "Delivered", "Pending"];

  const [filteredTrips, setFilteredTrips] = useState(shipments);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return { backgroundColor: "#FF3B30" }; // red
      case "In Transit":
        return { backgroundColor: "#007AFF" }; // blue
      case "Pending":
        return { backgroundColor: "#FF9500" }; // orange
      default:
        return { backgroundColor: "#aaa" };
    }
  };

  useEffect(() => {
    if (activeFilter === 'All Shipments') {
      setFilteredTrips(shipments);
    } else {
      setFilteredTrips(
        shipments.filter(trip => trip.status.toLowerCase() === activeFilter.toLowerCase())
      );
    }
  }, [activeFilter, shipments]);

  const renderShipment = ({ item }) => (
    <View style={styles.shipmentRow}>
      <Text style={styles.shipmentText}>{item.name}</Text>
      <Text style={styles.shipmentText}>{item.date}</Text>
      <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
      <Text style={styles.arrow}>{'>'}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <GoBack navigation={navigation}/>
        {/* <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backArrow}>{'<'}</Text>
        </TouchableOpacity> */}
        <Text style={styles.headerTitle}>Detailed Shipment Report</Text>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search"
        placeholderTextColor="#888"
      />

      {/* Filters */}
      <View style={styles.filterRow}>
        {filters.map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[
              styles.filterButton,
              activeFilter === filter && styles.activeFilter,
            ]}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText,
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Shipment List */}
      <FlatList
        data={filteredTrips}
        keyExtractor={(item) => item.id}
        renderItem={renderShipment}
        contentContainerStyle={{ paddingBottom: 80 }}
      />

      {/* Export Button */}
      <TouchableOpacity style={styles.exportButton}>
        <Text style={styles.exportText}>Export Report</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DetailedShipmentReport;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#121212",
    padding: 15,
  },
  header: {
    flexDirection: "row",
    // alignItems: "center",
    // marginVertical: 25,
    paddingVertical: 10,
  },
  backArrow: {
    color: "white",
    fontSize: 22,
    marginRight: 10,
  },
  headerTitle: {
          color: "#ff9800",
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 25,
  },
  searchBar: {
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 10,
    color: "white",
    marginBottom: 15,
  },
  filterRow: {
    flexDirection: "row",
    marginBottom: 15,
    flexWrap: "wrap",
  },
  filterButton: {
    backgroundColor: "#1E1E1E",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    marginRight: 10,
    marginBottom: 8,
  },
  filterText: {
    color: "#aaa",
    fontSize: 12,
  },
  activeFilter: {
    backgroundColor: "#ff9800",
  },
  activeFilterText: {
    color: "#fff",
  },
  shipmentRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1E1E1E",
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
  },
  shipmentText: {
    color: "white",
    fontSize: 14,
    flex: 1,
  },
  statusBadge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
  },
  arrow: {
    color: "#fff",
    fontSize: 18,
    marginLeft: 10,
  },
  exportButton: {
    backgroundColor: "#ff9800",
    padding: 14,
    borderRadius: 10,
    position: "absolute",
    bottom: 20,
    left: 16,
    right: 16,
    alignItems: "center",
  },
  exportText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
