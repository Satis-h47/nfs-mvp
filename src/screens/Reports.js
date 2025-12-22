import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialChart from "../screens/Director/MaterialChart";
import GoBack from "../components/GoBack";
import {useTrips} from '../context/TripContext'
const TABS = ["Day", 
    // "Month", 
    "Range"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const colors = {
  delivered: "#90caf9",
  pending: "#80deea",
  in_transit: "#ce93d8",
  planned: "#c5e1a5",
  draft: "#b0bec5",
  cancelled: "#fff59d",
  received: "#80cbc4",
  returned: "#ffcc80",
};

function getColour() {
  const letters = "0123456789ABCDEF";
  let colour = "#";
  for (let i = 0; i < 6; i++) {
    colour += letters[Math.floor(Math.random() * 16)];
  }
  return colour;
}

const Reports = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('');
const {globalApi, token, theme} = useTrips();
  // Day Tab State
  const [dayDate, setDayDate] = useState();
  const [showDayPicker, setShowDayPicker] = useState(false);

  // Month Tab State
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Range Tab State
  const [fromDate, setFromDate] = useState(); //new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const [toDate, setToDate] = useState();
  const [showFromPicker, setShowFromPicker] = useState(false);
  const [showToPicker, setShowToPicker] = useState(false);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
const [showChart, setShowChart] = useState(false);
const [reportParamsPie, setReportParamsPie] = useState(null);
const [reportParamsBar, setReportParamsBar] = useState(null);
const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const [toggle, setToggle] = useState(false);
  const [name, setName] = useState("Select site");
  const [list] = useState(["Site1", "Site2", "Site3"]);

useEffect(()=>{
  handleShowReport()
},[])

  const getReports = (from,to) => {
    const dateFrom = encodeURIComponent(`${from} 00:00:00`);
    const dateTo = encodeURIComponent(`${to} 23:59:59`);
    // console.log(dateFrom,dateTo)
  fetch(`${globalApi}/reports/material-flow?dateFrom=${dateFrom}&dateTo=${dateTo}`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    // console.log(data.data)
    setReportParamsPie(data.data.summary)
    setShowChart(true)
  })
  .catch(error => console.error('Error:', error));
  }

    const geShipments = (from,to) => {
    const dateFrom = encodeURIComponent(`${from} 00:00:00`);
    const dateTo = encodeURIComponent(`${to} 23:59:59`);
    // console.log(dateFrom,dateTo)
  fetch(`${globalApi}/shipments`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    // console.log(data.data)

if (!data.data || data.data.length < 1) return;

      const result = data.data.reduce((acc, item) => {
  const status = item.currentStatus;
  const qty = item.metadata?.quantity || 0;

  if (!acc[status]) {
    acc[status] = 0;
  }
  acc[status] += qty;

  return acc;
}, {});
// console.log(result)

      const resultPie = data.data.reduce((acc, item) => {
  const status = item.currentStatus;
  const qty = item.metadata?.quantity || 0;

  if (!acc[status]) {
    acc[status] = 0;
  }
  acc[status] += 1;

  return acc;
}, {});
// console.log(resultPie)

// Step 2: format it for charting (e.g. Chart.js or ECharts)
const chartData = Object.entries(resultPie).map(([status, total]) => ({
  status,
  totalQuantity: total,
}));

// console.log(chartData)

const PieData = Object.entries(resultPie).map(([status, total]) => ({
  label: { text: ((total / data.data.length) * 100).toFixed(2) + "%", fontSize: 14 },
  name: status,
  value: total,
  color: colors[status] ?? getColour()
}));

// console.log(PieData)

// const groupedData = {};

// // Helper function to format date
// const formatDate = (date) => new Date(date).toISOString().split('T')[0]; // Get YYYY-MM-DD

// data.data.forEach(item => {
//     const date = formatDate(item.createdAt);
//     const status = item.currentStatus;
//     const volume = item.metadata.volume;

//     if (!groupedData[date]) {
//         groupedData[date] = {};
//     }
    
//     if (!groupedData[date][status]) {
//         groupedData[date][status] = 0;
//     }

//     groupedData[date][status] += volume; // Aggregate the volume
// });

// Step 2: Prepare data for Chart.js
// const labels = Object.keys(groupedData); // Dates
// const datasets = [];

// const statuses = [...new Set(data.data.map(item => item.currentStatus))]; // Unique statuses

// // Initialize dataset for each status
// statuses.forEach(status => {
//     const dataset = {
//         label: status,
//         data: labels.map(date => groupedData[date][status] || 0), // Get volume for each date (0 if no data)
//         backgroundColor: getRandomColor(), // You can use different colors for each status
//         stack: 'stack1'
//     };
//     datasets.push(dataset);
// });

// Helper function to generate random colors
// function getRandomColor() {
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//         color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
// }

// console.log(groupedData);
// console.log(datasets);

    setReportParamsPie(PieData)
    setReportParamsBar(result)
    
    setShowChart(true)
  })
  .catch(error => console.error('Error:', error));
  }

  const toggleDropdown = () => {
    setToggle((prev) => !prev);
  };

  const handleSelect = (item) => {
    setName(item);
    setToggle(false);
  };

  // Handle changes and simulate API calls
const handleShowReport = () => {
  let payload = {};

  if (activeTab === "Day") {
    if (!dayDate) {
      alert("Please select a valid date.");
      return;
    }
    payload = { type: "day", from: dayDate.toISOString().split("T")[0], to: dayDate.toISOString().split("T")[0] };
  } else if (activeTab === "Month") {
    if (selectedYear < 1900 || selectedYear > 2100) {
      alert("Please enter a valid year.");
      return;
    }
    payload = {
      type: "month",
      month: selectedMonth + 1,
      year: selectedYear,
    };
  } else if (activeTab === "Range") {
    if (!fromDate || !toDate || fromDate > toDate) {
      alert("Please select a valid date range.");
      return;
    }
    payload = {
      type: "monthly",
      from: fromDate.toISOString().split("T")[0],
      to: toDate.toISOString().split("T")[0],
    };
  }

  // console.log("📦 Show Report Payload:", payload);
geShipments(payload.from, payload.to)
  // setReportParams(payload); // Save for future use if needed
  // setShowChart(true); // Show the chart
};



  const renderTabContent = () => {
    switch (activeTab) {
      case "Day":
        return (
<View>
  <TouchableOpacity
    style={styles.dateButton}
    onPress={() => setShowDayPicker(true)}
  >
    <Text style={styles.dateText}>{dayDate ? dayDate.toDateString() : 'Select'}</Text>
  </TouchableOpacity>
  {showDayPicker && (
    <DateTimePicker
      value={dayDate ? dayDate : new Date()}
      mode="date"
      display="default"
      onChange={(e, date) => {
        if (e.type === "set" && date) {
          setDayDate(date);
        }
        setShowDayPicker(false);
      }}
    />
  )}

  {/* <TouchableOpacity style={styles.showButton} onPress={handleShowReport}>
    <Text style={styles.showButtonText}>Show Report</Text>
  </TouchableOpacity> */}
</View>

        );

      case "Month":
        return (
<View>
  <View style={styles.dropdownWrapper}>
    {MONTHS.map((month, index) => (
      <TouchableOpacity
        key={month}
        style={[
          styles.monthOption,
          selectedMonth === index && styles.selectedMonthOption,
        ]}
        onPress={() => setSelectedMonth(index)}
      >
        <Text
          style={[
            styles.monthText,
            selectedMonth === index && styles.selectedMonthText,
          ]}
        >
          {month}
        </Text>
      </TouchableOpacity>
    ))}
  </View>

  <TextInput
    style={styles.yearInput}
    value={selectedYear.toString()}
    onChangeText={(text) => {
      const numericYear = parseInt(text, 10);
      if (!isNaN(numericYear)) {
        setSelectedYear(numericYear);
      }
    }}
    placeholder="Enter Year"
    placeholderTextColor="#888"
    keyboardType="numeric"
    maxLength={4}
  />

  {/* <TouchableOpacity style={styles.showButton} onPress={handleShowReport}>
    <Text style={styles.showButtonText}>Show Report</Text>
  </TouchableOpacity> */}
</View>

        );

      case "Range":
        return (
<View>
      <View style={styles.dateFilterRow}>
  <TouchableOpacity
    style={[styles.dateButton,{width:'48%'}]}
    onPress={() => setShowFromPicker(true)}
  >
    <Text style={styles.dateText}>{fromDate ? fromDate.toDateString() : 'From'}</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.dateButton,{width:'48%'}]}
    onPress={() => setShowToPicker(true)}
  >
    <Text style={styles.dateText}>{toDate ? toDate.toDateString() : 'To'}</Text>
  </TouchableOpacity>
</View>
  {showFromPicker && (
    <DateTimePicker
      value={fromDate ? fromDate : new Date()}
      mode="date"
      display="default"
      onChange={(e, date) => {
        if (e.type === "set" && date) {
          setFromDate(date);
        }
        setShowFromPicker(false);
      }}
    />
  )}

  {showToPicker && (
    <DateTimePicker
      value={toDate ? toDate : new Date()}
      mode="date"
      display="default"
      onChange={(e, date) => {
        if (e.type === "set" && date) {
          setToDate(date);
        }
        setShowToPicker(false);
      }}
    />
  )}

  {/* <TouchableOpacity style={styles.showButton} onPress={handleShowReport}>
    <Text style={styles.showButtonText}>Show Report</Text>
  </TouchableOpacity> */}
</View>

        );

      default:
        return null;
    }
  };

  return (
    <View style={[styles.container,{backgroundColor: theme.colors.background}]}>

        <View style={{flexDirection:'row',paddingVertical:10}}>
        <GoBack navigation={navigation}/>
      {/* Header */}
      <Text
        style={{
          fontSize: 20,
                  paddingTop:2,
          fontWeight: "bold",
          color: theme.colors.btnBack,
          textAlign:'center',
          marginVertical:Platform.OS === 'ios' ? 25 : 0
        }}
      >
        Reports
      </Text>
      </View>
      {/* <View >
        <GoBack navigation={navigation}/>
      </View>
      <Text style={styles.header}>Reports</Text> */}
<ScrollView>
            <View style={{ width: "100%" }}>
              <TouchableOpacity
                onPress={toggleDropdown}
                style={styles.dropdownButton}
              >
                <Text style={styles.dropdownText}>{name}</Text>
                <Text style={styles.arrow}>▼</Text>
              </TouchableOpacity>
      
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

      <View style={styles.tabRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabButton,
              activeTab === tab && styles.activeTab,
            ]}
            onPress={() => {
  setActiveTab(tab);
  setShowChart(false); // Hide chart on tab change
}}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.tabContent}>{renderTabContent()}</View>
        <TouchableOpacity style={styles.showButton} onPress={handleShowReport}>
    <Text style={styles.showButtonText}>Show Report</Text>
  </TouchableOpacity>

{showChart && (
  <View style={{ marginTop: 20 }}>
    <MaterialChart  reportsDataPie={reportParamsPie} reportsDataBar={reportParamsBar}/>
  </View>
)}
</ScrollView>
    </View>
  );
};

export default Reports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#aaa",
    // backgroundColor: "#292929ff",
    padding: 16,
  },
  header: {
    color: "#ff9800",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  tabRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#1e1e1e",
    width:'48%'
  },
  activeTab: {
    backgroundColor: "#ff3d00",
  },
  tabText: {
    color: "#ccc",
    fontWeight: "600",
  },
  activeTabText: {
    color: "#fff",
  },
  tabContent: {
    marginBottom: 20,
  },
  dateFilterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  dateButton: {
    backgroundColor: "#1e1e1e",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    // width:"48%"
  },
  dateText: {
    color: "#fff",
    textAlign: "center",
  },
  dropdownWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  monthOption: {
    width: "30%",
    backgroundColor: "#1e1e1e",
    marginVertical: 6,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  selectedMonthOption: {
    backgroundColor: "#ff3d00",
  },
  monthText: {
    color: "#ccc",
  },
  selectedMonthText: {
    color: "#fff",
    fontWeight: "600",
  },
  showButton: {
  backgroundColor: "#ff3d00",
  paddingVertical: 12,
  borderRadius: 8,
  marginTop: 16,
  alignItems: "center",
},
showButtonText: {
  color: "#fff",
  fontWeight: "bold",
},
yearInput: {
  backgroundColor: "#1e1e1e",
  color: "#fff",
  borderRadius: 8,
  padding: 10,
  marginTop: 12,
  textAlign: "center",
},
label: {
  color: "#fff",
  fontWeight: "600",
  marginBottom: 8,
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
});
