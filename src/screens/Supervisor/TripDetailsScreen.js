import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image,Dimensions, ImageBackground, TextInput } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useTrips } from "../../context/TripContext";
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

const [selectedFilter, setSelectedFilter] = useState('All');
const [filteredTrips, setFilteredTrips] = useState(trips);

useEffect(() => {
  if (selectedFilter === 'All') {
    setFilteredTrips(trips);
  } else {
    setFilteredTrips(
      trips.filter(trip => trip.action.toLowerCase() === selectedFilter.toLowerCase())
    );
  }
}, [selectedFilter, trips]);


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
        <Text style={{ color: "white", fontSize: 16 }}> - {item.destination}</Text>
        </Text>
        <Text style={{ color: "white", fontSize: 16 }}>PONumber: {item.poNumber}</Text>
        <Text style={{ color: actionColors[item.action], fontSize: 16 }}>{item.action}</Text>
        </View>
      </View>

      {/* Right arrow (using text) */}
      <Text style={{ color: "#ff9800", fontSize: 18 }}>{'>'}</Text>
    </TouchableOpacity>
  );

  return (
                <ImageBackground 
          source={require('../../assets/images/rawBG.jpg')} // Path to your image
          style={{ width, height }}
          resizeMode="cover"
        >
    <View style={{ flex: 1,
    //  backgroundColor: "#121212", 
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 16 }}>
      {/* Header */}
      <Text
        style={{
          fontSize: 20,
          fontWeight: "bold",
          color: "#ff9800",
          textAlign:'center',
          marginTop: 25,
          marginBottom: 25,
        }}
      >
        All Trip Details
      </Text>
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
    </View>
    </ImageBackground>
  );
};

export default TripDetailsScreen;
