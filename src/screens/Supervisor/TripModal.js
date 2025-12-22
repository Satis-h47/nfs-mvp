// TripDetailsScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Button, TextInput } from 'react-native';
import { useTrips } from '../../context/TripContext';
import GoBack from '../../components/GoBack';
import Dropdown from '../../components/Dropdown';

const example =     {
      "id": "dbb5c125-bea1-4bdd-9cda-87e4baa771fe",
      "trackingNumber": "SHP-MHBLP8Y4-BY64E3",
      "originAddress": {
        "city": "string",
        "state": "tg",
        "street": "string",
        "country": "string",
        "postalCode": "string"
      },
      "destinationAddress": {
        "city": "string",
        "state": "ap",
        "street": "string",
        "country": "string",
        "postalCode": "string"
      },
      "currentStatus": "draft",
      "currentStage": "CREATED",
      "entityId": "80cadab7-42ba-4609-a1b7-71b2d172f9bf",
      "createdBy": "6be10861-91d2-4b01-87e7-7690aef0ff81",
      "sourceType": "mine",
      "sourceId": "74b02790-bf6f-4e7a-a96c-8585dcd0b0ed",
      "destinationType": "yard",
      "destinationId": "3c7f43f8-0c20-440b-85c5-8624130f1a2e",
      "metadata": {
        "volume": 200,
        "priority": "low",
        "quantity": 200,
        "materialId": "577272c0-df9e-473a-a2ea-ba6f3bb383ff",
        "material_code": "COPPER_CONC",
        "scheduled_pickup": "2024-03-20T08:00:00Z"
      },
      "createdAt": "2025-10-29T06:14:47.692Z",
      "updatedAt": "2025-10-29T06:14:47.692Z"
    }

const displayLabels = {
  draft : "Draft",
  pending: 'Pending',
  in_transit:"In Transit",
  delivered:"Delivered",
  received:"Received",
  cancelled:"Cancelled",
  returned:"Returned"
}

const TripModal = ({ navigation, route }) => {
  // console.log("source",route.params.source)
  const { user, trips, getTrip, updateTrip, token, deleteTrip, globalApi, theme } = useTrips();
  const { shipment: routeShipment } = route.params || {}; // Get shipment data passed from form

const [shipment, setShipment] = useState(() => route.params.shipment || null);
const [listTV, setListTV] = useState(() => {
  if (user === 'Supervisor') {
    return {value:'pending', label:'Pending'};
  }
  return route.params.shipment?.currentStatus || '';
});
  
  const [listOV, setListOV] = useState('draft');
      const [listThV, setListThV] = useState('in_transit');

        useEffect(() => {
    if (trips) {
      const foundShipment = getTrip(routeShipment.id);
      setShipment(foundShipment);
    }
  }, [trips]);

const listOne = [
  // { label: 'Draft', value: 'draft', disable: false },
  // { label: 'Pending', value: 'pending', disable: false },
  // { label: 'In Transit', value: 'in_transit', disable: false },
  { label: 'Received', value: 'received', disable: false },
  { label: 'Cancelled', value: 'cancelled', disable: false },
  { label: 'Returned', value: 'returned', disable: false }
]

const listTwo = [
  { label: 'Draft', value: 'draft', disable: true },
  { label: 'Pending', value: 'pending', disable: false },
  { label: 'In Transit', value: 'in_transit', disable: false },
  { label: 'Delivered', value: 'delivered', disable: false },
  { label: 'Received', value: 'received', disable: false },
  { label: 'Cancelled', value: 'cancelled', disable: false },
  { label: 'Returned', value: 'returned', disable: false }
]

const listThree = [
  { label: 'Draft', value: 'draft', disable: true },
  { label: 'Pending', value: 'pending', disable: false },
  { label: 'In Transit', value: 'in_transit', disable: false },
  { label: 'Delivered', value: 'delivered', disable: false },
  { label: 'Cancelled', value: 'cancelled', disable: false },
  { label: 'Returned', value: 'returned', disable: false }
]

const statusShipment = () => {
    fetch(`${globalApi}/shipments/${shipment?.id}/status`, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
  "status": `${listTV.value}`})
})
  .then(response => response.json())
  .then(data => {
    if(data?.success) {
        //  console.log(data)
    updateTrip(data.data.id, data.data)
    }
    else console.error('Error: Select valid status')
    // navigation.goBack()
  })
  .catch(error => console.error('Error:', error));
}

  const putShipment = () =>{
    fetch(`${globalApi}/shipments/${shipment?.id}`, {
  method: 'PUT',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "originAddress": {
      "street": "Golden Street",
      "city": "string",
      "state": "string",
      "postalCode": "string",
      "country": "string"
    },
    "destinationAddress": {
      "street": "string",
      "city": "Tanuku",
      "state": "string",
      "postalCode": "string",
      "country": "string"
    },
    "metadata": {}
  })
})
  .then(response => response.json())
  .then(data => navigation.goBack())
  .catch(error => console.error('Error:', error));
  }

  const deleteShipment = () => {
    fetch(`${globalApi}/shipments/${shipment?.id}`, {
  method: 'DELETE',
  headers: {
    'Accept': '*/*',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => {
    if (response.ok) {
      // console.log('Shipment deleted successfully');
      deleteTrip(shipment?.id)
      navigation.goBack()
    } else {
      console.error('Failed to delete shipment');
    }
  })
  .catch(error => console.error('Error:', error));

  } 

  return (
    <View style={[styles.container,{backgroundColor: theme.colors.background}]}>
            <View style={{flexDirection:'row',paddingVertical:10}}>
        <GoBack navigation={navigation}/>
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
                Shipment Details
              </Text>
      </View>
      
            
{/* <View style={{marginTop:100, backgroundColor:'white',borderRadius:10, padding:20}}> */}
<View
  style={{
    backgroundColor: theme.colors.card,
    borderRadius: 12,
    padding: 16,
    // margin: 16,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.15,
    // shadowRadius: 6,
    // elevation: 5,
    // marginTop:100
  }}
>
  <View style={{ alignItems: "flex-end" }}>
    <TouchableOpacity
  style={styles.editButton}
      onPress={() => navigation.navigate("AddTrip",{
      shipment: shipment,  
      source: route.params.source,
    edit : true
    })}
>
  <Text style={styles.editButtonText}>Edit</Text>
</TouchableOpacity>
  </View>

  <Text
    style={{
      fontSize: 18,
      fontWeight: "bold",
      color: theme.colors.text,
      marginTop: 8,
      marginBottom: 4,
    }}
  >
    {shipment?.clientName}
  </Text>

  <Text
    style={{
      fontSize: 16,
      fontWeight: "600",
      marginBottom: 8,
      color:theme.colors.text
    }}
  >
    Status:{" "}
    <Text style={{      color:
        shipment?.currentStatus === "delivered"
          ? "#28a745"
          : shipment?.currentStatus === "in_transit"
          ? "#ffc107"
          : "#dc3545"
          }}>
    {displayLabels[shipment?.currentStatus]}
    </Text>
  </Text>

  <View
    style={{
      borderTopWidth: 1,
      borderTopColor: "#000",
      paddingTop: 8,
      marginBottom: 8,
    }}
  >
    <Text style={{ fontSize: 16, color: theme.colors.text, marginBottom: 6 }}>
      Product:{" "}
      <Text style={{ fontWeight: "600" }}>{shipment?.product}
      </Text>
    </Text>
    <Text style={{ fontSize: 16, color: theme.colors.text, marginBottom: 6 }}>
      From:{" "}
      <Text style={{ fontWeight: "600" }}>
        {shipment?.originAddress.city}, {shipment?.originAddress.state}
      </Text>
    </Text>
    <Text style={{ fontSize: 16, color: theme.colors.text, marginBottom: 6 }}>
      To:{" "}
      <Text style={{ fontWeight: "600" }}>
        {shipment?.destinationAddress.city}, {shipment?.destinationAddress.state}
      </Text>
    </Text>
        <Text style={{ fontSize: 16, color: theme.colors.text}}>
      Quantity:{" "}
      <Text style={{ fontWeight: "600" }}>{shipment?.metadata.quantity}</Text>
    </Text>
  </View>

  {/* <View
    style={{
      backgroundColor: "#000",
      borderRadius: 8,
      padding: 10,
      paddingHorizontal:20,
      paddingVertical:15,
      // borderWidth: 1,
      // borderColor: "#e5e5e5",
    }}
  >
    <Text style={{ fontSize: 15, color: "#fff", marginBottom: 6 }}>
      Quantity:{" "}
      <Text style={{ fontWeight: "600" }}>{shipment?.metadata.quantity}</Text>
    </Text>
    <Text style={{ fontSize: 15, color: "#fff", marginBottom: 6 }}>
      Priority:{" "}
      <Text style={{ fontWeight: "600" }}>{shipment?.metadata.priority}</Text>
    </Text>
    <Text style={{ fontSize: 15, color: "#fff" }}>
      Volume: <Text style={{ fontWeight: "600" }}>{shipment?.metadata.volume}</Text>
    </Text>
  </View> */}
{/* </View> */}

      {/* <Text>{shipment?.trackingNumber}</Text>
      <Text>{shipment?.currentStatus}</Text>
      <Text>From : {shipment?.originAddress.city},{shipment?.originAddress.state}</Text>
      <Text>To : {shipment?.destinationAddress.city},{shipment?.destinationAddress.state}</Text>
      <Text>{shipment?.currentStatus}</Text>
      <Text>Quantity : {shipment?.metadata.quantity}</Text>
      <Text>Priority : {shipment?.metadata.priority}</Text>
      <Text>Volume : {shipment?.metadata.volume}</Text> */}
      </View>
            <View style={{ marginTop: 12 }}>
        <Text style={{ fontSize: 15, color:theme.colors.text, fontWeight: "600", marginBottom: 6, marginLeft: 4 }}>
          Add a Comment:
        </Text>
        <TextInput
          // value={comment}
          // onChangeText={setComment}
          placeholder="Enter your comment..."
          placeholderTextColor={theme.colors.text}
          multiline
          style={{
            height: 80,
            // borderColor: "#000",
            // borderWidth: 1,
            borderRadius: 8,
            padding: 16,
            textAlignVertical: "top",
            color:theme.colors.text,
            backgroundColor: theme.colors.card,
          }}
        />
      </View>
      {/* <ScrollView>
        <Text style={styles.title}>Trip Details</Text>

        {trip ? (
          Object.entries(trip).map(([key, value]) => {
            if(key === 'id'){
              return
            }
  if (key === 'photoEmpty' || key === 'photoLoaded') {
    return (
      <View key={key} style={styles.detailRow}>
        <Text style={styles.label}>{key}</Text>
        {value ? (
          <Image source={{ uri: value }} style={styles.image} />
        ) : (
          <Text style={styles.value}>N/A</Text>
        )}
      </View>
    );
  }

  return (
    <View key={key} style={styles.detailRow}>
      <Text style={styles.label}>{key}</Text>
      <Text style={styles.value}>{value ?? 'N/A'}</Text>
    </View>
  );
})
        ) : (
          <Text style={styles.noData}>No trip data available</Text>
        )}
        {
          user == "Supervisor" &&
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>Back</Text>
        </TouchableOpacity>
        }
        {
        user == "Manager" &&
        <View style={{flexDirection:'row'}}>
        <TouchableOpacity
          onPress={() => {
            updateTrip(trip.id, { action: "Approved" })
          navigation.goBack()
          }}
          style={styles.closeButton}
        >
          <Text style={[styles.closeButtonText, {color:'green'}]}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            // console.log(trip.id,"dsa")
            updateTrip(trip.id, { action: "Rejected" })
          navigation.goBack()
          }}
          style={styles.closeButton}
        >
          <Text style={[styles.closeButtonText, {color:'red'}]}>Reject</Text>
        </TouchableOpacity>
        </View>
        }
      </ScrollView> */}
                  {/* <Dropdown
        data={listOne}
        value={listOV}
        onChange={setListOV}
        // placeholder="Choose a destination"
      /> */}

{ user == "Manager"  &&
<View
  style={{
    // width: '50%',
    flexDirection: 'row',
    // backgroundColor:'green',
    alignItems: 'center', // vertically center text and dropdown
    // justifyContent: 'space-between', // space out text and dropdown
  }}
>
  <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight:'bold', marginHorizontal:10
    // backgroundColor:'red'
     }}>Status:</Text>

  <Dropdown
    data={listTwo}
    keyValue={listTV.value}
    onChange={setListTV}
    containerStyle={{
      flex:1,
    }}
  />
</View>
}

{ user == "Supervisor"  && route.params?.tab == 'incoming' &&
<View
  style={{
    // width: '50%',
    flexDirection: 'row',
    // backgroundColor:'green',
    alignItems: 'center', // vertically center text and dropdown
    // justifyContent: 'space-between', // space out text and dropdown
  }}
>
  <Text style={{ color: theme.colors.text, fontSize: 16, fontWeight:'bold', marginHorizontal:10
    // backgroundColor:'red'
     }}>Status:</Text>

  <Dropdown
    data={listOne}
    keyValue={listTV.value}
    onChange={setListTV}
    containerStyle={{
      flex:1,
    }}
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
  />
</View>
}

                  {/* <Dropdown
        data={listThree}
        value={listThV}
        onChange={setListThV}
        // placeholder="Choose a destination"
      /> */}
        <View style={{flexDirection:'row'}}>
              <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[styles.closeButton,{backgroundColor: theme.colors.btnBack}]}
        >
          <Text style={styles.closeButtonText}>Back</Text>
        </TouchableOpacity>
              {/* <TouchableOpacity
          onPress={() => deleteShipment()}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>Cancel</Text>
        </TouchableOpacity> */}
              {/* <TouchableOpacity
          onPress={() => putShipment()}
          style={styles.closeButton}
        >
          <Text style={styles.closeButtonText}>Update</Text>
        </TouchableOpacity> */}
              <TouchableOpacity disabled={listTV.value === shipment?.currentStatus}
          onPress={() => statusShipment()}
          style={[styles.closeButton,{backgroundColor: theme.colors.btnBack}, listTV.value === shipment?.currentStatus && { opacity: 0.5 }]}
        >
          <Text style={styles.closeButtonText}>Submit</Text>
        </TouchableOpacity>
        </View>
    </View>
  );
};

export default TripModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // backgroundColor: "#292929ff",
    padding: 20,
    // marginTop:50
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
  },
  detailRow: {
    marginBottom: 12,
  },
  label: {
    fontWeight: 'bold',
    textTransform: 'capitalize',
    fontSize: 16,
  },
  value: {
    color: '#444',
    fontSize: 15,
    marginTop: 2,
  },
  noData: {
    textAlign: 'center',
    marginTop: 40,
    color: '#888',
    fontSize: 16,
  },
  closeButton: {
    flex:1,
    marginTop: 25,
    // backgroundColor: '#ff9800',
    padding: 12,
    borderRadius: 8,
    // alignSelf: 'center',
    // width: '50%',
    margin:5
  },
  closeButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
  image: {
  width: 100,
  height: 100,
  resizeMode: 'cover',
  marginTop: 5,
},
  editButton: {
    borderWidth: 1,
    borderColor: '#007bff',
    paddingVertical: 5,
    paddingHorizontal:10,
    borderRadius: 15,
    alignItems: 'center',
    // backgroundColor: 'white',   // outline style
  },
  editButtonText: {
    color: '#007bff',
    fontSize: 16,
    fontWeight: '600',
  }
});
