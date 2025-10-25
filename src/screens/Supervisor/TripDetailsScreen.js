import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image,Dimensions, ImageBackground, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useTrips } from "../../context/TripContext";
import GoBack from "../../components/GoBack";
const { width, height } = Dimensions.get('window');
const TripDetailsScreen = ({route}) => {
  const { trips, addTrip } = useTrips();
  // console.log(route.params.source, trips)
  // const [tripData, setTripData] = useState('')
  const navigation = useNavigation();
  let Url = "https://img.icons8.com/ios/100/000000/warehouse.png";
  
const [searchText, setSearchText] = useState('');
// const [filteredTrips, setFilteredTrips] = useState(trips);

  const actionColors = {
  Rejected: "red",
  Pending: "orange",
  Approved: "green",
};

  // useEffect(()=>{
  //   addTrip(allTrips[0])
  // },[])
const [clientFilterModalVisible, setClientFilterModalVisible] = useState(false);
const [selectedClients, setSelectedClients] = useState([]);
const [allClients, setAllClients] = useState([]);
const [tempSelectedClients, setTempSelectedClients] = useState([]);

const [selectedFilter, setSelectedFilter] = useState('All');
const [filteredTrips, setFilteredTrips] = useState(trips);

useEffect(() => {
  const clients = [...new Set(trips.map(trip => trip.clientName))];
  setAllClients(clients);
}, [trips]);


useEffect(() => {
  let filtered = trips;

  if (selectedFilter !== 'All') {
    filtered = filtered.filter(trip => trip.action.toLowerCase() === selectedFilter.toLowerCase());
  }

  if (selectedClients.length > 0) {
    filtered = filtered.filter(trip => selectedClients.includes(trip.clientName));
  }

  setFilteredTrips(filtered);
}, [selectedFilter, trips, selectedClients]);


  const renderTripCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("TripModal",{trip:(item)})}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: "#2A2A2A",
        padding: 16,
        marginVertical: 8,
        borderRadius: 12,
      }}
    >
      {/* Left side icon + text */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: 'https://img.icons8.com/ios/100/ffffff/container-truck.png' }}
          style={{ width: 24, height: 24, marginRight: 12, tintColor: "white" }}
        />
        <View>
        <Text style={{ color: "white", fontSize: 16 }}>{item.date}</Text>
        <Text style={{flexDirection:'row'}}>
        <Text style={{ color: "white", fontSize: 16 }}>{item.source}</Text>
        <Text style={{ color: "white", fontSize: 16 }}> {'=>'} {item.destination}</Text>
        </Text>
        <Text style={{ color: "white", fontSize: 16 }}>PONumber: {item.poNumber}</Text>
        <Text style={{ color: "white", fontSize: 16 }}>Client: {item.clientName}</Text>
        <Text style={{ color: actionColors[item.action], fontSize: 16 }}>{item.action}</Text>
        </View>
      </View>

      {/* Right arrow (using text) */}
      <Text style={{ color: "#ff9800", fontSize: 18 }}>{'>'}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1,
    //  backgroundColor: "#121212", 
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 16 }}>
        <View style={{flexDirection:'row',paddingVertical:10}}>
        <GoBack navigation={navigation}/>
      {/* Header */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#ff9800",
          textAlign:'center',
          marginVertical:25
        }}
      >
        All Trip Details
      </Text>
      </View>
<View style={{
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginBottom: 16,
}}>
  {['All', 'Approved', 'Pending', 'Rejected'].map(status => (
    <TouchableOpacity
      key={status}
      onPress={() => setSelectedFilter(status)}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 16,
        backgroundColor: selectedFilter === status ? '#ff9800' : '#333',
        borderRadius: 20,
      }}
    >
      <Text style={{ color: 'white', fontWeight: 'bold' }}>{status}</Text>
    </TouchableOpacity>
  ))}
</View>

<TouchableOpacity
  onPress={() => {
    setTempSelectedClients(selectedClients); // Snapshot current selection
    setClientFilterModalVisible(true);
  }}
>
  <Text style={{ color: '#ff9800', fontWeight: 'bold', marginBottom: 10 }}>
    Filter by Client
  </Text>
</TouchableOpacity>


{selectedClients.length > 0 && (
  <Text style={{ color: 'white', marginBottom: 10 }}>
    Showing trips for: {selectedClients.join(', ')}
  </Text>
)}


      {/* Trip List */}
      <FlatList
        data={filteredTrips}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTripCard}
      />

      {/* Bottom Navigation */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 40,
          // paddingVertical: 16,
          // position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          // backgroundColor: "#1E1E1E",
        }}
      >
        {/* Home Button */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={{ uri: Url }}
            style={{ width: 18, height: 18, tintColor: "white" }}
          />
        </TouchableOpacity>

        {/* Plus Button */}
        <TouchableOpacity onPress={() => navigation.navigate("AddTrip",{source: route.params.source})}
          style={{
            backgroundColor: "#ff9800",
            borderRadius: 25,
            // paddingHorizontal: 15,
            width:50,
            height:50,
            alignItems:'center',
            bottom:15
          }}
        >
          {/* <Image
            source={{ uri: Url }}
            style={{ width: 28, height: 28, tintColor: "white" }}
          /> */}
          <Text style={{ color: "white", fontSize: 35 }}>+</Text>
        </TouchableOpacity>

                <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={{ uri: 'https://img.icons8.com/ios/100/ffffff/worker-male.png' }}
            style={{ width: 18, height: 18, tintColor: "white" }}
          />
        </TouchableOpacity>
      </View>

      {clientFilterModalVisible && (
  <View style={{
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    zIndex:2
  }}>
    <View style={{
      width: '100%',
      backgroundColor: '#333',
      borderRadius: 10,
      padding: 20
    }}>
      <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>Select Clients</Text>

      {allClients.map((client, index) => (
        <TouchableOpacity
          key={index}
onPress={() => {
  if (tempSelectedClients.includes(client)) {
    setTempSelectedClients(prev => prev.filter(c => c !== client));
  } else {
    setTempSelectedClients(prev => [...prev, client]);
  }
}}
          style={{
            flexDirection:'row',
            paddingVertical: 10,
            paddingHorizontal: 12,
            marginVertical: 5,
            borderRadius: 8,
            backgroundColor: "#555"
            // tempSelectedClients.includes(client) ? '#ff9800' : '#555',
          }}
        >
      <View
        style={{
          backgroundColor: tempSelectedClients.includes(client) ? 'red' : 'white',
          height: 20,
          width: 20,
          borderWidth: 1,
          borderColor: 'black',
          borderRadius: 2,
          marginHorizontal: 10,
          // justifyContent: 'center',
          // alignItems: 'center',
        }}
      >
{tempSelectedClients.includes(client) && (
  <View style={{ position: 'relative', width: 12, height: 12 }}>
    {/* Short arm of check */}
    <View
      style={{
        position: 'absolute',
        left: 3,
        top: 6,
        width: 5,
        height: 10,
        backgroundColor: 'white',
        transform: [{ rotate: '-45deg' }],
        borderRadius: 1,
      }}
    />
    {/* Long arm of check */}
    <View
      style={{
        position: 'absolute',
        left: 9,
        top: 2,
        width: 5,
        height: 15,
        backgroundColor: 'white',
        transform: [{ rotate: '45deg' }],
        borderRadius: 1,
      }}
    />
  </View>
)}
      </View>
          <Text style={{ color: 'white' }}>{client}</Text>
        </TouchableOpacity>
      ))}

      {/* Buttons */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
      }}>
<TouchableOpacity onPress={() => setClientFilterModalVisible(false)}>
  <Text style={{ color: 'white' }}>Cancel</Text>
</TouchableOpacity>

<TouchableOpacity onPress={() => {
  setSelectedClients(tempSelectedClients); // Only apply now
  setClientFilterModalVisible(false);
}}>
  <Text style={{ color: '#ff9800', fontWeight: 'bold' }}>Apply</Text>
</TouchableOpacity>


<TouchableOpacity onPress={() => {
  setSelectedClients([]);
  setTempSelectedClients([]);
  setClientFilterModalVisible(false);
}}>
  <Text style={{ color: 'red' }}>Reset</Text>
</TouchableOpacity>

      </View>
    </View>
  </View>
)}

    </View>
  );
};

export default TripDetailsScreen;
