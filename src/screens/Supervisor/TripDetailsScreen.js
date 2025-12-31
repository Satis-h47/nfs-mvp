import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, Image,Dimensions, ImageBackground, TextInput, Alert, Button, StyleSheet, ActivityIndicator } from "react-native";
import { useNavigation } from "@react-navigation/native";

import { useTrips } from "../../context/TripContext";
import GoBack from "../../components/GoBack";
const { width, height } = Dimensions.get('window');

const displayLabels = {
  draft : "Draft",
  pending: 'Pending',
  in_transit:"In Transit",
  delivered:"Delivered",
  received:"Received",
  cancelled:"Cancelled",
  returned:"Returned"
}

function formatTimestamp(oldTimestamp) {
  const date = new Date(oldTimestamp);

  // Format the date as DD/MM/YYYY HH:mm
  return date.toLocaleString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false // Ensures 24-hour format
  });
}

  const actionColors = {
  draft : "blue",
  pending: 'orange',
  in_transit:"yellow",
  delivered:"green",
  received:"green",
  cancelled:"red",
  returned:"green"
};

const TripDetailsScreen = ({route}) => {
  const { trips, addTrip, token, setTrips, globalApi, theme } = useTrips();
  // const [tripData, setTripData] = useState('')
  const navigation = useNavigation();
  let Url = "https://img.icons8.com/ios/100/000000/warehouse.png";
  const [tab, setTab]= useState('outgoing');
const [searchText, setSearchText] = useState('');
// const [filteredTrips, setFilteredTrips] = useState(trips);

  // useEffect(()=>{
  //   addTrip(allTrips[0])
  // },[])
const [clientFilterModalVisible, setClientFilterModalVisible] = useState(false);
const [selectedClients, setSelectedClients] = useState([]);
const [allClients, setAllClients] = useState([]);
const [tempSelectedClients, setTempSelectedClients] = useState([]);

const [selectedFilter, setSelectedFilter] = useState('all');
const [filteredTrips, setFilteredTrips] = useState([]);
const [inFilteredTrips, setInFilteredTrips] = useState([]);
const [incomingShipments, setIncomingShipments] = useState([]);
const [outGoingShip, setOutGoingShip] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
// console.log("trips", filteredTrips)
  useEffect(() => {
    const getData = async () => {
    setIsLoading(true);
    try {
      await getShipments()
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);  // Ensures the loading state is always turned off
    }
    };
        if (token) {
      getData()
    }
  }, [token]);

    useEffect(() => {
      setOutGoingShip(trips.filter(ship => ship.sourceId == route.params.source.id));
      setIncomingShipments(trips.filter(ship => ship.destinationId == route.params.source.id))
  }, [trips]);

useEffect(() => {
  const clients = [...new Set(trips.map(trip => trip.clientName))];
  setAllClients(clients);
}, [trips]);

async function getShipments(){
  try {
  const response = await fetch(`${globalApi}/shipments?sortOrder=DESC`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
});
  const data = await response.json();
  console.log(data?.data)
    setTrips(data?.data || []) //.filter(ship => ship.sourceId == route.params.source.id)
    // setOutGoingShip(data?.data.filter(ship => ship.sourceId == route.params.source.id) || [])
    // setIncomingShipments(data?.data.filter(ship => ship.destinationId == route.params.source.id) || [])
} catch (error) {
    console.error('Error:', error);
  }
  }

useEffect(() => {
  let filtered = outGoingShip;
  let inFiltered = incomingShipments

  if (selectedFilter !== 'all') {
    filtered = filtered.filter(trip => trip.currentStatus.toLowerCase() === selectedFilter.toLowerCase());
    inFiltered = inFiltered.filter(trip => trip.currentStatus.toLowerCase() === selectedFilter.toLowerCase());
  }

  if (selectedClients.length > 0) {
    filtered = filtered.filter(trip => selectedClients.includes(trip.clientName));
    inFiltered = inFiltered.filter(trip => selectedClients.includes(trip.clientName));
  }

  setFilteredTrips(filtered);
  setInFilteredTrips(inFiltered)
}, [selectedFilter, outGoingShip, incomingShipments, selectedClients]);


  const renderTripCard = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate("TripModal",{shipment:(item), tab:tab, source: route.params.source})}
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        backgroundColor: theme.colors.card,
        padding: 16,
        marginVertical: 8,
        borderRadius: 12,
      }}
    >
      {/* Left side icon + text */}
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Image
          source={{ uri: 'https://img.icons8.com/ios/100/ffffff/container-truck.png' }}
          style={{ width: 24, height: 24, marginRight: 12, tintColor: theme.colors.text}}
        />
        <View>
        <Text style={[styles.titleText,{ color: theme.colors.text}]}>{formatTimestamp(item.updatedAt)}</Text>
        <Text style={[styles.titleText,{ color: theme.colors.text}]}>{item.clientName}</Text>
        <Text style={[styles.titleText,{ color: theme.colors.text}]}>{item.product}</Text>
        <Text style={{flexDirection:'row'}}>
        <Text style={[styles.titleText,{ color: theme.colors.text}]}>{item.originAddress.state}</Text>
        <Text style={[styles.titleText,{ color: theme.colors.text}]}> {'=>'} {item.destinationAddress.state}</Text>
        </Text>
        {/* <Text style={{ color: "white", fontSize: 16 }}>PONumber: {item.poNumber}</Text>
        <Text style={{ color: "white", fontSize: 16 }}>Client: {item.clientName}</Text> */}
        <Text style={{ color: actionColors[item.currentStatus], fontSize: 16 }}>{displayLabels[item.currentStatus]}</Text>
        </View>
      </View>

      {/* Right arrow (using text) */}
      <View>
        {item.currentStatus == 'draft' &&     
        <TouchableOpacity style={{}} onPress={() =>{
                   Alert.alert(
              "Are you sure ?",
              "You want to delete shipment",
              [
                {
                  text: "OK",
                  // onPress: () => navigation.goBack(), // only goes back after pressing OK
                },
              ],
              { cancelable: false }
            );
        }}>
        <Image
          source={require('../../assets/images/Delete.png')}
          style={{ width: 18, height: 18}}
        />
        </TouchableOpacity>
        }
      <Text style={{ color: theme.colors.btnBack, fontSize: 40}}>{'>'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1,
    backgroundColor: theme.colors.background,
    //  backgroundColor: "#121212", 
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
      padding: 16 
      }}>
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
        All Shipment Details
      </Text>
      </View>
{ route.params.source?.yardCode  &&   <View style={[styles.container,{backgroundColor: theme.colors.border}]}>
      <TouchableOpacity
        style={[styles.tab, tab === 'outgoing' && {backgroundColor: theme.colors.btnBack}]}
        onPress={() => setTab('outgoing')}
      >
        <Text style={[styles.tabText, {color: theme.colors.text}, tab === 'outgoing' && styles.activeText,tab === 'outgoing' && {color: '#fff'}]}>
          Outgoing
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, tab === 'incoming' && {backgroundColor: theme.colors.btnBack}]}
        onPress={() => setTab('incoming')}
      >
        <Text style={[styles.tabText, {color: theme.colors.text}, tab === 'incoming' && styles.activeText, tab === 'incoming' && {color: '#fff'}]}>
          Incoming
        </Text>
      </TouchableOpacity>
    </View>
    }
    <View style={{
  flexDirection: 'row',
  justifyContent: 'space-around',
  marginBottom: 16,
  flexWrap:'wrap',
  alignItems: 'center',
}}>
  {[ 'all','draft',
'pending',
'in_transit',
'delivered',
'cancelled',
'returned'].map(status => (
    <TouchableOpacity
      key={status}
      onPress={() => setSelectedFilter(status)}
      style={{
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: selectedFilter === status ? theme.colors.btnBack : theme.colors.card,
        borderRadius: 20,
        marginBottom: 10, // Add margin between the rows
        marginRight: 10,  // Add margin between columns
      }}
    >
      <Text style={{ color: selectedFilter === status ? '#fff' : theme.colors.text, fontWeight: 'bold', fontSize:17 }}>{status}</Text>
    </TouchableOpacity>
  ))}
</View>

<TouchableOpacity
  onPress={() => {
    setTempSelectedClients(selectedClients); // Snapshot current selection
    setClientFilterModalVisible(true);
  }}
>
  <Text style={{ color: theme.colors.btnBack, fontWeight: 'bold', marginBottom: 10 }}>
    Filter by Client
  </Text>
</TouchableOpacity>


{selectedClients.length > 0 && (
  <Text style={{ color: theme.colors.text, marginBottom: 10 }}>
    Showing trips for: {selectedClients.join(', ')}
  </Text>
)}


{  tab == 'outgoing' &&    <View style={{}}>
      {/* Trip List */}
          { isLoading ?  <View style={{ flex: 1,paddingVertical:40, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="small" color={theme.colors.btnBack} />
        {/* <Text style={{color:'white'}}>Loading...</Text> */}
        </View> :
          (filteredTrips.length === 0) ? 
    <Text style={{color: theme.colors.text,margin:50,textAlign:'center'}}>No shipments found</Text>
    :
    <View style={{height:'75%'}}>
      <FlatList
        data={filteredTrips}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTripCard}
      />
      </View>
          }
</View>
}
{
  tab == 'incoming' && <View style={{}}>
    {(inFilteredTrips.length === 0) ? 
    <Text style={{color: theme.colors.text,margin:50,textAlign:'center'}}>No shipments found</Text>
    :
      <FlatList
        data={inFilteredTrips}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderTripCard}
      />
      }
  </View>
}

      {/* Bottom Navigation */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingHorizontal: 40,
          // paddingVertical: 16,
          position: "absolute",
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
            style={{ width: 18, height: 18, tintColor: theme.colors.text }}
          />
        </TouchableOpacity>

        {/* Plus Button */}
        <TouchableOpacity onPress={() => navigation.navigate("AddTrip",{source: route.params.source})}
          style={{
            backgroundColor: theme.colors.btnBack,
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

                <TouchableOpacity disabled onPress={() => navigation.navigate('AddressForm')}>
          {/* <Image
            source={{ uri: 'https://img.icons8.com/ios/100/ffffff/worker-male.png' }}
            style={{ width: 18, height: 18, tintColor: "white" }}
          /> */}
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
      backgroundColor: theme.colors.card,
      borderRadius: 10,
      padding: 20
    }}>
      <Text style={{ color: theme.colors.text, fontSize: 18, marginBottom: 20, marginTop:10 }}>Select Clients</Text>

      {allClients.length > 0 && allClients.map((client, index) => (
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
            // marginVertical: 5,
            borderRadius: 8,
            alignItems:'center',
            // backgroundColor: "#555",
            // tempSelectedClients.includes(client) ? '#ff9800' : '#555',
          }}
        >
      <View
        style={{
          backgroundColor: tempSelectedClients.includes(client) ? 'white' : 'white',
          height: 21,
          width: 21,
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
        left: 4,
        top: 7,
        width: 3,
        height: 10,
        backgroundColor: 'grey',
        transform: [{ rotate: '-45deg' }],
        borderRadius: 1,
      }}
    />
    {/* Long arm of check */}
    <View
      style={{
        position: 'absolute',
        left: 10,
        top: 3,
        width: 3,
        height: 15,
        backgroundColor: 'grey',
        transform: [{ rotate: '45deg' }],
        borderRadius: 1,
      }}
    />
  </View>
)}
      </View>
          <Text style={{ color: theme.colors.secText, fontSize: 14 }}>{client}</Text>
        </TouchableOpacity>
      ))}

      {/* Buttons */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 30, 
        marginBottom:12
      }}>
<TouchableOpacity onPress={() => setClientFilterModalVisible(false)}>
  <Text style={{ color: theme.colors.text }}>Cancel</Text>
</TouchableOpacity>

<TouchableOpacity onPress={() => {
  setSelectedClients(tempSelectedClients); // Only apply now
  setClientFilterModalVisible(false);
}}>
  <Text style={{ color: theme.colors.btnBack, fontWeight: 'bold' }}>Apply</Text>
</TouchableOpacity>


<TouchableOpacity onPress={() => {
  setSelectedClients([]);
  setTempSelectedClients([]);
  setClientFilterModalVisible(false);
}}>
  <Text style={{ color: theme.colors.text }}>Reset</Text>
</TouchableOpacity>

      </View>
    </View>
  </View>
)}

    </View>
  );
};

export default TripDetailsScreen;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    // backgroundColor: '#F3F4F6',
    borderRadius: 10,
    padding: 2,
    marginBottom: 16,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    // backgroundColor: '#ff9800', // iOS blue look — change as needed
    // shadowColor: '#000',
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.15,
    // shadowRadius: 3,
    // elevation: 2,
  },
  tabText: {
    // color: '#555',
    fontSize: 16,
    fontWeight: '500',
  },
  activeText: {
    // color: '#fff',
    fontWeight: '600',
  },
  titleText: { fontSize: 16 }
});
