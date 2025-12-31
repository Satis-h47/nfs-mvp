import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  ScrollView,
  Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialChart from "./Director/MaterialChart";
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

const MaterialReports = ({navigation}) => {
  const [activeTab, setActiveTab] = useState('Day');
const {globalApi, token, theme} = useTrips();
  // Day Tab State
  const [dayDate, setDayDate] = useState(new Date());
  const [showDayPicker, setShowDayPicker] = useState(false);

  // Month Tab State
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());

  // Range Tab State
  const [fromDate, setFromDate] = useState(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)); //new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  const [toDate, setToDate] = useState(new Date());
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

    const [selected, setSelected] = useState('Day');

  // const RadioOption = ({ label }) => (
  //   <TouchableOpacity
  //     style={styles.option}
  //     onPress={() => setSelected(label)}
  //     activeOpacity={0.7}
  //   >
  //     <View style={styles.outerCircle}>
  //       {selected === label && <View style={styles.innerCircle} />}
  //     </View>
  //     <Text style={{
  //   fontSize: 16,
  // }}>{label}</Text>
  //   </TouchableOpacity>
  // );

useEffect(()=>{
  handleShowReport()
},[])

  const getReports = (from,to) => {
    const dateFrom = encodeURIComponent(`${from} 00:00:00`);
    const dateTo = encodeURIComponent(`${to} 23:59:59`);
    console.log(dateFrom,dateTo)
  fetch(`${globalApi}/reports/management/material-flow?dateFrom=${from}&dateTo=${to}`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    console.log(data)
    if(data?.error) {console.error(data.error); return}
if (Object.keys(data?.data?.summary.currentStatusCount).length < 1) {
      alert("No records found");
    return;
}
    const reportsPieData = Object.entries(data.data.summary.currentStatusCount).map(([status, total]) => ({
  label: { text: ((total.count / data.data.summary.totalShipments) * 100).toFixed(2) + "%", fontSize: 14 },
  name: status,
  value: total.count,
  color: colors[status] ?? getColour()
}));

const reportsBar = Object.entries(data.data.summary.currentStatusCount).map(
  ([status, data]) => data.quantity)

const labels = Object.keys(data.data.summary.currentStatusCount)
// Extract values as data
// const dataValues = Object.values(data.data.summary.currentStatusCount);
const reportsBarData = {
  labels: labels,
  datasets: [
    {
      data: reportsBar,
    },
  ],
}; 

    setReportParamsPie(reportsPieData)
    setReportParamsBar(reportsBarData)
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
console.log("bar chart data",result)

      const resultPie = data.data.reduce((acc, item) => {
  const status = item.currentStatus;
  const qty = item.metadata?.quantity || 0;

  if (!acc[status]) {
    acc[status] = 0;
  }
  acc[status] += 1;

  return acc;
}, {});
console.log(resultPie)

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

console.log("pie chart data",PieData)

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

  const getDayRange = (date) => {
  const start = new Date(date);
  start.setUTCHours(0,0,0,0);

  const end = new Date(date);
  end.setUTCHours(23,59,59,999);

  return { from: start.toISOString(), to: end.toISOString() };
};

  // Handle changes and simulate API calls
const handleShowReport = () => {
  let payload = {};

  if (activeTab === "Day") {
  if (!dayDate) { alert("Select a valid date"); return; }
  if( dayDate > new Date())  { alert("Please select today or a past date."); return; }
  payload = { type: "day", ...getDayRange(dayDate) };
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
    if(fromDate > new Date())  { alert("Future dates are not allowed."); return; }
  if (!fromDate || !toDate || fromDate > toDate) { alert("Select a valid range"); return; }
payload = {
  type: "monthly",
  from: getDayRange(fromDate).from, // start of fromDate
  to: getDayRange(toDate).to,       // end of toDate
};
  }

  // console.log("📦 Show Report Payload:", payload);
// geShipments(payload.from, payload.to)
getReports(payload.from, payload.to)
  // setReportParams(payload); // Save for future use if needed
  // setShowChart(true); // Show the chart
};



  const renderTabContent = () => {
    switch (activeTab) {
      case "Day":
        return (
<View>
  <TouchableOpacity
    style={[styles.dateButton,{flexDirection:'row'}]}
    onPress={() => setShowDayPicker(true)}
  >
    <Text style={styles.dateText}>{dayDate ? dayDate.toDateString() : 'Select'}</Text>
          <Image source={{ uri: 'https://img.icons8.com/ios/100/000000/calendar.png' }} style={[{
    width: 20,
    height: 20,
    // tintColor: "#ff9800",
    // marginBottom: 15,
  },{tintColor : theme.colors.btnBack}]} />
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

      {/* <View >
        <GoBack navigation={navigation}/>
      </View>
      <Text style={styles.header}>Reports</Text> */}
<ScrollView>
            {/* <View style={{ width: "100%" }}>
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
            </View> */}
            
<View style={styles.filterContainer}>

  {/* DAY ROW */}
  <View style={styles.dayRow}>
    <TouchableOpacity
      style={styles.option}
      onPress={() => {setActiveTab('Day')
  setShowChart(false)}}
      activeOpacity={0.7}
    >
      <View style={styles.outerCircle}>
        {activeTab === 'Day' && <View style={styles.innerCircle} />}
      </View>
      <Text style={styles.label}>Day</Text>
    </TouchableOpacity>

    {activeTab === 'Day' && (
      <TouchableOpacity
        style={styles.dayDateButton}
        onPress={() => setShowDayPicker(true)}
      >
        <Text style={styles.dateText}>
          {dayDate ? dayDate.toDateString() : 'Select'}
        </Text>

        <Image
          source={{ uri: 'https://img.icons8.com/ios/100/000000/calendar.png' }}
          style={[styles.icon, { tintColor: theme.colors.btnBack }]}
        />
      </TouchableOpacity>
    )}
  </View>

  {/* RANGE ROW */}
  <TouchableOpacity
    style={styles.option}
    onPress={() => {setActiveTab('Range')
  setShowChart(false)}}
    activeOpacity={0.7}
  >
    <View style={styles.outerCircle}>
      {activeTab === 'Range' && <View style={styles.innerCircle} />}
    </View>
    <Text style={styles.label}>Range</Text>
  </TouchableOpacity>

  {/* RANGE CONTENT */}
  {activeTab === 'Range' && (
    <View style={styles.rangeContent}>
      <View style={styles.dateFilterRow}>
<TouchableOpacity
  style={[styles.dateButton, styles.halfWidth]}
  onPress={() => setShowFromPicker(true)}
>
  <Text style={styles.dateText}>
    {fromDate ? fromDate.toDateString() : 'From'}
  </Text>

  <Image
    source={{ uri: 'https://img.icons8.com/ios/100/000000/calendar.png' }}
    style={[styles.icon, { tintColor: theme.colors.btnBack }]}
  />
</TouchableOpacity>

<TouchableOpacity
  style={[styles.dateButton, styles.halfWidth]}
  onPress={() => setShowToPicker(true)}
>
  <Text style={styles.dateText}>
    {toDate ? toDate.toDateString() : 'To'}
  </Text>

  <Image
    source={{ uri: 'https://img.icons8.com/ios/100/000000/calendar.png' }}
    style={[styles.icon, { tintColor: theme.colors.btnBack }]}
  />
</TouchableOpacity>

      </View>
    </View>
  )}

  {/* DAY PICKER */}
  {showDayPicker && (
    <DateTimePicker
      value={dayDate || new Date()}
      mode="date"
      display="default"
      onChange={(e, date) => {
        if (e.type === 'set' && date) setDayDate(date);
        setShowDayPicker(false);
        setShowChart(false)
      }}
    />
  )}

  {/* RANGE PICKERS */}
  {showFromPicker && (
    <DateTimePicker
      value={fromDate || new Date()}
      mode="date"
      display="default"
      onChange={(e, date) => {
        if (e.type === 'set' && date) setFromDate(date);
        setShowChart(false)
        setShowFromPicker(false);
      }}
    />
  )}

  {showToPicker && (
    <DateTimePicker
      value={toDate || new Date()}
      mode="date"
      display="default"
      onChange={(e, date) => {
        if (e.type === 'set' && date) setToDate(date);
        setShowToPicker(false);
        setShowChart(false)
      }}
    />
  )}

</View>



      {/* <View style={styles.tabRow}>
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
      </View> */}

      {/* {activeTab == 'Range' && <View style={styles.tabContent}>{renderTabContent()}</View>} */}

<TouchableOpacity
  style={styles.showButton}
  onPress={handleShowReport}
  activeOpacity={0.8}
>
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

export default MaterialReports;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
  },
filterContainer: {
  minHeight: 150,  // reserve space
},
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    minHeight:50,
  },

  option: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  outerCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },

  label: {
    fontSize: 16,
  },

  dayDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
    borderColor: '#ccc',
    minWidth: 140,
    justifyContent: 'space-between',
  },

  rangeContent: {
    marginTop: 10,
    // marginLeft: 28, // aligns under "Range" text
  },

  dateFilterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

dateButton: {
  flexDirection: 'row',           // 🔑 important
  alignItems: 'center',
  justifyContent: 'space-between', // text left, icon right
  paddingHorizontal: 12,
  paddingVertical: 12,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#ccc',
},

dateText: {
  fontSize: 14,
  color: '#333',
},

icon: {
  width: 18,
  height: 18,
  marginHorizontal:5
},

halfWidth: {
  width: '48%',
},

showButton: {
  marginTop: 16,
  backgroundColor: 'skyblue', // primary color
  paddingVertical: 12,
  borderRadius: 10,
  alignItems: 'center',
  justifyContent: 'center',
},

showButtonText: {
  color: '#fff',
  // fontSize: 16,
  // fontWeight: '600',
  // letterSpacing: 0.3,
},
//   showButton: {
//   backgroundColor: "#ff3d00",
//   paddingVertical: 12,
//   borderRadius: 8,
//   marginTop: 16,
//   alignItems: "center",
// },
// showButtonText: {
//   color: "#fff",
//   fontWeight: "bold",
// }

});

