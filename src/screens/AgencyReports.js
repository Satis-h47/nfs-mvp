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
  FlatList,
  Pressable,
  Modal,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import MaterialChart from "./Director/MaterialChart";
import GoBack from "../components/GoBack";
import {useTrips} from '../context/TripContext'
import Dropdown from '../components/Dropdown'

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

const AgencyReports = () => {
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
const [reportValues, setReportValues] = useState(null);
const [reportParamsBar, setReportParamsBar] = useState(null);
const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i);

  const [toggle, setToggle] = useState(false);
  const [name, setName] = useState("Select site");
  const [list] = useState(["Site1", "Site2", "Site3"]);

  
    const [agencies, setAgencies] = useState([]);
    const [vehicles, setVehicles] = useState([]);

    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedAgency, setSelectedAgency] = useState(null);

    
  const [selected, setSelected] = useState([]);
const [visible, setVisible] = useState(false);


  const [selectedVehicles, setSelectedVehicles] = useState([]);
const [visibleVehicles, setVisibleVehicles] = useState(false);

    const selectedNames = agencies
  .filter(a => selected.includes(a.id))
  .map(a => a.name)
  .join(', ');

  const toggleItem = (item) => {
    setSelected((prev) =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };
  
      const selectedNamesVehicles = vehicles
  .filter(a => selectedVehicles.includes(a.id))
  .map(a => a.vehicleId)
  .join(', ');

  const toggleItemVehicles = (item) => {
    setSelectedVehicles((prev) =>
      prev.includes(item)
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

useEffect(()=>{
  handleShowReport()
  getAgencies()
},[])

// useEffect(() => {
//   if(selectedAgency == null) console.log("null vehicles")
//   else getVehicles();
// }, [selectedAgency])

useEffect(() => {
  setSelectedVehicles([])
}, [selected])

useEffect(() => {
  setShowChart(false)
}, [selected, selectedVehicles])

useEffect(() => {
  if (!visible && selected.length > 0) {
    // Modal closed, fetch all vehicles
    const fetchAllVehicles = async () => {
      try {
        const allVehicles = await Promise.all(
          selected.map(async (id) => {
            const response = await fetch(`${globalApi}/agencies/${id}/vehicles`, {
              method: 'GET',
              headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });
            const data = await response.json();
            return data.data.vehicles; // return the vehicles array for each agency
          })
        );

        // Flatten the array of arrays
        const mergedVehicles = allVehicles.flat();
        setVehicles(mergedVehicles);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchAllVehicles();
  }
}, [visible]);


const getAgencies= () => {
    fetch(`${globalApi}/agencies`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    // console.log(data.data.agencies)
    // let destList = Object.values(data.data).flat()
//     const updatedArr = data.data.agencies?.map(item => ({
//   value: item.id, //item.id
//   label: item.name
// }));
    setAgencies(data.data.agencies || [])
  })
  .catch(error => console.error('Error:', error));
}

const getVehicles= () => {
    fetch(`${globalApi}/agencies/${selectedAgency.id}/vehicles`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    // console.log("tyres",data)
    // let destList = Object.values(data.data).flat()
//     const updatedArr = data.data.vehicles?.map(item => ({
//   value: item.id, //item.id
//   label: item.vehicleId,
//   vehicleType: item.vehicleType,
//   capacity: item.capacity
// }));
    // console.log(updatedArr || [])
    setVehicles(data.data.vehicles || [])
  })
  .catch(error => console.error('Error:', error));
}

  const getReports = (from,to) => {
    
    const params = new URLSearchParams();

if (selectedVehicles?.length) {
  const vehicleIds = selectedVehicles.map(a => a).join(",");
  params.append("agencyIds", vehicleIds);
}

// if (selectedVehicle?.id) {
//   params.append("vehicleIds", selectedVehicle.id);
// }

if (from) {
  params.append("dateFrom", from);
}

if (to) {
  params.append("dateTo", to);
}

// if (selectedAgency?.id) {
//   params.append("agencyIds", selectedAgency.id);
// }

if (selected?.length) {
  const agencyIds = selected.map(a => a).join(",");
  params.append("agencyIds", agencyIds);
}

const url = `${globalApi}/reports/vehicle-agency/vehicle-agency-flow${
  params.toString() ? `?${params.toString()}` : ""
}`;

console.log('url', url)
    // console.log(`${globalApi}/reports/vehicle-agency/vehicle-agency-flow?vehicleIds=${selectedVehicle?.id}&dateFrom=${from}&dateTo=${to}&agencyIds=${selectedAgency?.id}`)
  fetch(url, {
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
if (Object.keys(!data?.data || data?.data?.summary).length < 1) {
      alert("No records found");
    return;
}
//     const reportsPieData = Object.entries(data.data.summary.currentStatusCount).map(([status, total]) => ({
//   label: { text: ((total.count / data.data.summary.totalShipments) * 100).toFixed(2) + "%", fontSize: 14 },
//   name: status,
//   value: total.count,
//   color: colors[status] ?? getColour()
// }));

const reportsBar = Object.entries(data?.data?.summary).map(
  ([status, data]) => data)

const labels = Object.keys(data?.data?.summary)
// // Extract values as data
// // const dataValues = Object.values(data.data.summary.currentStatusCount);
const reportsBarData = {
  labels: labels,
  datasets: [
    {
      data: reportsBar,
    },
  ],
}; 

    setReportValues(data?.data?.summary || {})
    setReportParamsBar(reportsBarData)
    setShowChart(true)
  })
  .catch(error => console.error('Error:', error));
  }

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
        setShowChart(false)
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
        setShowChart(false)
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
        setShowChart(false)
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

    return(
    <View style={[styles.container,{backgroundColor: theme.colors.background}]}>

      {/* <View >
        <GoBack navigation={navigation}/>
      </View>
      <Text style={styles.header}>Reports</Text> */}
<ScrollView>

                             {/* <Dropdown
        data={agencies}
        keyValue={selectedAgency?.id}
        onChange={(val)=>{
          setSelectedAgency(val)
          setShowChart(false)
        }}

  labelField = "name"
  valueField = "id"
        placeholder="Choose agency"

        dropdownStyle={{
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  }}
        placeholderStyle={{
    color: theme.colors.placeholderTxt
  }}
        selectedTextStyle={{
    color: theme.colors.secText
  }}
        optionStyle={{
    backgroundColor: theme.colors.card
  }}
        optionTextStyle={{
    color: theme.colors.secText
  }}
  selectedOptionStyle = {{
    backgroundColor:theme.colors.border
  }}
        modalContainerStyle={{
    backgroundColor: theme.colors.background
  }}  
  arrowStyle={{
    color: theme.colors.placeholderTxt
  }}
      /> */}

<View>
  {/* Input */}
  <TouchableOpacity
    onPress={() => setVisible(true)}
    style={{
      padding: 12,
      borderWidth: 1,
      borderColor: '#ccc',
      marginVertical:4,
      borderRadius: 6
    }}
  >
    <Text>
      {selected.length > 0 ? selectedNames : 'Choose Agency'}
    </Text>
  </TouchableOpacity>

  {/* Layer / Overlay */}
  <Modal
    visible={visible}
    transparent
    animationType="fade"
  >
    {/* Backdrop (click outside to close) */}
    <Pressable
      style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        padding: 20
      }}
      onPress={() => setVisible(false)}
    >
      {/* Stop propagation */}
      <Pressable
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 10,
          maxHeight: '60%'
        }}
        onPress={() => {}}
      >
        <FlatList
          data={agencies}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
<TouchableOpacity
  onPress={() => toggleItem(item.id)}
  activeOpacity={0.7}
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  }}
>
  <View
    style={{
      height: 22,
      width: 22,
      borderWidth: 1.5,
      borderColor: '#333',
      borderRadius: 4,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    }}
  >
    {selected.includes(item.id) && (
      <View
        style={{
          width: 14,
          height: 14,
          position: 'relative',
        }}
      >
        {/* Short arm */}
        <View
          style={{
            position: 'absolute',
            left: 3,
            top: 7,
            width: 3,
            height: 8,
            backgroundColor: '#555',
            transform: [{ rotate: '-45deg' }],
            borderRadius: 1,
          }}
        />

        {/* Long arm */}
        <View
          style={{
            position: 'absolute',
            left: 8,
            top: 2,
            width: 3,
            height: 14,
            backgroundColor: '#555',
            transform: [{ rotate: '45deg' }],
            borderRadius: 1,
          }}
        />
      </View>
    )}
  </View>

  <Text
    style={{
      fontSize: 16,
      color: '#222',
    }}
  >
    {item.name}
  </Text>
</TouchableOpacity>

          )}
        />
        <Text onPress={() => setVisible(false)} style={{textAlign:'right',margin:5}}>Done</Text>
      </Pressable>
    </Pressable>
  </Modal>
</View>

                    {/* <Dropdown
        data={vehicles}
        keyValue={selectedVehicle?.id}
        onChange={(val) => {
          setSelectedVehicle(val)
          setShowChart(false)
  }}
    labelField = "vehicleId"
  valueField = "id"
        placeholder="Choose vehicle"

        dropdownStyle={{
    backgroundColor: theme.colors.card,
    borderColor: theme.colors.border,
  }}
        placeholderStyle={{
    color: theme.colors.placeholderTxt,
  }}
        selectedTextStyle={{
    color: theme.colors.secText,
  }}
        optionStyle={{
    backgroundColor: theme.colors.card,
    borderBottomColor: theme.colors.border
  }}
        optionTextStyle={{
    color: theme.colors.secText,
  }}
  selectedOptionStyle = {{
    backgroundColor:theme.colors.border
  }}
        modalContainerStyle={{
    backgroundColor: theme.colors.background,
  }}
  arrowStyle={{
    color: theme.colors.placeholderTxt
  }}
      /> */}

<View>
  {/* Input */}
  <TouchableOpacity disabled={!selected.length > 0}
    onPress={() => setVisibleVehicles(true)}
    style={{
      padding: 12,
      borderWidth: 1,
      marginVertical:4,
      borderColor: '#ccc',
      borderRadius: 6,
      opacity: !selected.length > 0 ? 0.5 : 1
    }}
  >
    <Text>
      {selectedVehicles.length > 0 ? selectedNamesVehicles : 'Choose Vehicles'}
    </Text>
  </TouchableOpacity>

  {/* Layer / Overlay */}
  <Modal
    visible={visibleVehicles}
    transparent
    animationType="fade"
  >
    {/* Backdrop (click outside to close) */}
    <Pressable
      style={{
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        padding: 20
      }}
      onPress={() => setVisibleVehicles(false)}
    >
      {/* Stop propagation */}
      <Pressable
        style={{
          backgroundColor: '#fff',
          borderRadius: 8,
          padding: 10,
          maxHeight: '60%'
        }}
        onPress={() => {}}
      >
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
<TouchableOpacity
  onPress={() =>  toggleItemVehicles(item.id)}
  activeOpacity={0.7}
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
  }}
>
  <View
    style={{
      height: 22,
      width: 22,
      borderWidth: 1.5,
      borderColor: '#333',
      borderRadius: 4,
      backgroundColor: 'white',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    }}
  >
    {selectedVehicles.includes(item.id) && (
      <View
        style={{
          width: 14,
          height: 14,
          position: 'relative',
        }}
      >
        {/* Short arm */}
        <View
          style={{
            position: 'absolute',
            left: 3,
            top: 7,
            width: 3,
            height: 8,
            backgroundColor: '#555',
            transform: [{ rotate: '-45deg' }],
            borderRadius: 1,
          }}
        />

        {/* Long arm */}
        <View
          style={{
            position: 'absolute',
            left: 8,
            top: 2,
            width: 3,
            height: 14,
            backgroundColor: '#555',
            transform: [{ rotate: '45deg' }],
            borderRadius: 1,
          }}
        />
      </View>
    )}
  </View>

  <Text
    style={{
      fontSize: 16,
      color: '#222',
    }}
  >
    {item.vehicleId}
  </Text>
</TouchableOpacity>

          )}
        />
        <Text onPress={() => setVisibleVehicles(false)} style={{textAlign:'right',margin:5}}>Done</Text>
      </Pressable>
    </Pressable>
  </Modal>
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
      <View style={{height:150}}>
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
renderTabContent()
    )}
</View>

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

  {activeTab === 'Range' && (
renderTabContent()
  )}
</View>
      {/* <View style={styles.tabContent}>{renderTabContent()}</View> */}


        <TouchableOpacity style={styles.showButton} onPress={handleShowReport}>
    <Text style={styles.showButtonText}>Show Report</Text>
  </TouchableOpacity>

<View style={{margin:20}}></View>
{
    reportValues &&  showChart && Object.entries(reportValues).map(([name, value])=>
    <Text key={name} style={{margin:3,fontWeight: 'bold'}}>{name}: <Text style={{fontWeight:'300'}}>{value}</Text></Text>
    )
}
{showChart && (
  <View style={{ marginTop: 20 }}>
    <MaterialChart reportsDataBar={reportParamsBar}/>
  </View>
)}
</ScrollView>
    </View>
    )
}

export default AgencyReports;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#aaa",
    // backgroundColor: "#292929ff",
    // padding: 16,
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
    // marginBottom: 20,
  },
  dateFilterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
//   dateButton: {
//     backgroundColor: "#1e1e1e",
//     borderRadius: 8,
//     padding: 12,
//     marginBottom: 12,
//     // width:"48%"
//   },
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
//   dateText: {
//     color: "#fff",
//     textAlign: "center",
//   },
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
  backgroundColor: "skyblue",
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
//   color: "#fff",
//   fontWeight: "600",
fontSize:16,
// margin: 8,
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
  rangeContent: {
    marginTop: 10,
    // marginLeft: 28, // aligns under "Range" text
  },
  innerCircle: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#000',
  },
  
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 15,
    minHeight:50,
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
dateText: {
  fontSize: 14,
  color: '#333',
},

halfWidth: {
  width: '48%',
},
icon: {
  width: 18,
  height: 18,
  marginHorizontal:5
},
});