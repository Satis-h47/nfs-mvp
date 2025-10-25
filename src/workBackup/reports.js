import React, { useState, useEffect } from "react";
// import MaterialChart if you use it
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialChart from '../screens/Director/MaterialChart'
export default function Reports() {
  const [searchQuery, setSearchQuery] = useState("");
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [expandedReportId, setExpandedReportId] = useState(null); // 👈 new state

const [originalReports, setOriginalReports] = useState([
  { id: "ADJ1001", deliveryDate: "2025-10-10" },
  { id: "CPT2020", deliveryDate: "2025-10-09" },
  { id: "SHP2016", deliveryDate: "2025-10-07" },
  { id: "MNP2031", deliveryDate: "2025-10-06" },
]);
const [reports, setReports] = useState(originalReports);

const filterReports = () => {
  let filtered = originalReports;

  // Filter by date range
  if (fromDate && toDate) {
    filtered = filtered.filter((report) => {
      const reportDate = new Date(report.deliveryDate);
      return reportDate >= fromDate && reportDate <= toDate;
    });
  }

  // Filter by search query
  if (searchQuery.trim() !== "") {
    const query = searchQuery.trim().toLowerCase();
    filtered = filtered.filter((report) =>
      report.id.toLowerCase().includes(query)
    );
  }

  setReports(filtered);
};


  const toggleExpand = (id) => {
    setExpandedReportId((prevId) => (prevId === id ? null : id));
  };

  const renderReport = ({ item }) => {
    const isExpanded = expandedReportId === item.id;

    return (
      <View>
        <TouchableOpacity
          style={styles.reportCard}
          onPress={() => toggleExpand(item.id)}
        >
          <View>
            <Text style={styles.reportId}>{item.id}</Text>
            <Text style={styles.reportDate}>{item.deliveryDate}</Text>
          </View>
          <View style={{ alignItems: "flex-end" }}>
            <Text style={styles.value}>{isExpanded ? "▼" : "► "}</Text>
          </View>
        </TouchableOpacity>

        {isExpanded && (
          <View style={{ marginBottom: 10 }}>
            <MaterialChart />
          </View>
        )}
      </View>
    );
  };

  useEffect(() => {
  // Apply search when user types
  filterReports();
}, [searchQuery]);

  return (
    <View style={styles.container}>      
    <Text style={styles.header}>Reports</Text>

      {/* 🔍 Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search ..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* 📅 Date Range Filters */}
      <View style={styles.dateFilterRow}>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowFromPicker(true)}
        >
          <Text style={styles.dateText}> {fromDate ? fromDate.toDateString() : 'From'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => setShowToPicker(true)}
        >
          <Text style={styles.dateText}>{toDate ? toDate.toDateString() : 'To'}</Text>
        </TouchableOpacity>
      </View>
<TouchableOpacity
  style={[
    styles.filterButton,
    !(fromDate && toDate) && styles.filterButtonDisabled, // apply disabled style
  ]}
  onPress={filterReports}
  disabled={!(fromDate && toDate)} // disable if dates are missing
>
  <Text
    style={[
      styles.filterText,
      !(fromDate && toDate) && styles.filterTextDisabled,
    ]}
  >
    Filter
  </Text>
</TouchableOpacity>


      {/* Date Pickers */}
      {showFromPicker && (
        <DateTimePicker
          value={fromDate ? fromDate : new Date()}
          mode="date"
          display="default"
          onChange={(e, date) => {
            setShowFromPicker(false);
            if (e.type === "set" &&  date) setFromDate(date);
          }}
        />
      )}
      {showToPicker && (
        <DateTimePicker
          value={toDate ? toDate : new Date()}
          mode="date"
          display="default"
          onChange={(e, date) => {
              setShowToPicker(false);
              if (e.type === "set" && date) setToDate(date);
          }}
        />
      )}
      <FlatList
        data={reports}
        keyExtractor={(item) => item.id}
        renderItem={renderReport}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#101010",
    padding: 16,
  },
  header: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 12,
    textAlign: "center",
  },
  searchBar: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#fff",
    marginBottom: 14,
  },
  dateFilterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 10,
    width: "48%",
  },
  filterButton:{
    backgroundColor: "#ff3d00",
    borderRadius: 8,
    padding: 10,
    // width: "48%",
    marginBottom: 16,
},
  dateText: {
    color: "#ccc",
    textAlign: "center",
  },
  filterText: {
    color: "#fff",
    textAlign: "center",
  },
  filterButtonDisabled: {
  backgroundColor: "#333", // darker/less vibrant
},
filterTextDisabled: {
  color: "#555", // faded text
},
  reportCard: {
    backgroundColor: "#1c1c1c",
    borderRadius: 10,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  reportId: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  reportDate: {
    color: "#aaa",
    fontSize: 12,
  },
  status: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 5,
    fontSize: 12,
    fontWeight: "600",
    overflow: "hidden",
    marginBottom: 4,
  },
  delivered: {
    backgroundColor: "#4CAF50",
    color: "#fff",
  },
  inTransit: {
    backgroundColor: "#FF9800",
    color: "#fff",
  },
  pending: {
    backgroundColor: "#f44336",
    color: "#fff",
  },
  value: {
    color: "#bbb",
    fontSize: 13,
  }
});
