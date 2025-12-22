import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image, Dimensions,
  ImageBackground,
  Alert
} from "react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import { useTrips } from "../../context/TripContext";
import { Picker } from '@react-native-picker/picker';
import Dropdown from "../../components/Dropdown";
import GoBack from "../../components/GoBack";
const { width, height } = Dimensions.get('window');
const products = [{value:'Bauxite',label:'Bauxite'},{value:'Iron',label:'Iron'},{value:'Manganese',label:'Manganese'}]
const AddTripScreen = ({navigation, route}) => {
    const [destinations, setDestinations] = useState([]);
    const [clients, setClients] = useState([]);
    const [agencies, setAgencies] = useState([]);
    const [vehicles, setVehicles] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedClient, setSelectedClient] = useState(route.params?.shipment ? route.params.shipment.clientName : null);
  const [selectedAgency, setSelectedAgency] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState({value:'Bauxite', label:'Bauxite'});
    // console.log("Add Trip",route.params.source, selectedDestination, selectedAgency, selectedVehicle, selectedProduct)
  const { trips, addTrip, token, globalApi, updateTrip, theme } = useTrips();
  const [form, setForm] = useState({
    id: trips.length+1 || 1,
    date: "",
    source: "",
    poNumber: route.params?.shipment?.poNumber || "",
    destination: "",
    invoice: route.params?.shipment?.invoice || "",
    royaltyWaybill: route.params?.shipment?.royaltyWaybill || "",
    product: route.params?.shipment?.product || "Bauxite",
    clientName: route.params?.shipment?.clientName || "",
    transportVendor: "NFS",
    vehicleNumber: "",
    vehicleType: "",
    tyres: route.params?.shipment?.metadata?.tyres || "",
    capacity: "",
    quantity: route.params?.shipment?.metadata?.quantity || "10",
    photoEmpty: null,
    photoLoaded: route.params?.shipment?.destinationAddress.postalCode || null,
    action:"Pending"
  });
  const [errors, setErrors] = useState({});
const getType = () =>{
    if(route.params.source?.mineCode) return "mine"
    else if(route.params.source?.yardCode) return "yard"
    else if(route.params.source?.customerCode) return "customer"
  }

let payload = {
  "originAddress": {
    "street": "string",
    "city": route.params.source.locality,
    "state": route.params.source.town,
    "postalCode": "string",
    "country": "string"
  },
  "destinationAddress": {
    "street": "string",
    "city": selectedDestination?.locality,
    "state": selectedDestination?.town,
    "postalCode": form.photoLoaded,
    "country": "string"
  },
  "entityId": "f65a330f-c722-402a-8e5a-079babb1a846", //a6e086fa-ac55-4d9d-846a-76a2d4fcb2ab
  "sourceType": getType(),
  "sourceId": `${route.params.source.id}`,
  "destinationType": "yard",
  "destinationId": selectedDestination?.id,
      "poNumber": form.poNumber,
      "invoice": form.invoice,
      "royaltyWaybill": form.royaltyWaybill,
      "product": selectedProduct?.value,
      "clientName": selectedClient?.name,
      "transportVendor": form.transportVendor,
  "metadata": {
  // "volume": 200,
  // "priority": "low",
  "quantity": form.quantity,
  "tyres":form.tyres,
  "vehicleId": selectedVehicle?.id
  // "materialId": "577272c0-df9e-473a-a2ea-ba6f3bb383ff",
  // "material_code": "COPPER_CONC",
  // "scheduled_pickup": "2024-03-20T08:00:00Z"
}
};

useEffect(()=>{
  getDestination();
  getClients()
  getAgencies()
},[]);

useEffect(() => {
    if (route.params?.shipment) {
      const foundExist = destinations.find(item => item.id === route.params?.shipment.destinationId);
      // console.log('foundExist', foundExist)
      setSelectedDestination(foundExist)
    }
  }, [destinations]);
  
  useEffect(() => {
    if (route.params?.shipment) {
      const foundExist = clients.find(item => item.name === route.params?.shipment.clientName);
      // console.log('foundExist', foundExist)
      setSelectedClient(foundExist)
    }
  }, [clients]);

  useEffect(() => {
    if (route.params?.shipment) {
      const foundExist = products.find(item => item.value === route.params?.shipment.product);
      // console.log('foundExist', foundExist)
      setSelectedProduct(foundExist)
    }
  }, [products]);

    useEffect(() => {
    if (route.params?.shipment) {
      // const foundExist = agencies.find(item => item.value === route.params?.shipment.product);
      // console.log('foundExist', foundExist)
      // setSelectedProduct(foundExist)
      fetch(`${globalApi}/vehicles/${route.params?.shipment.metadata.vehicleId}/agency`,{
        headers:{
          Authorization: `Bearer ${token}`
        }
      })
      .then(res => res.json())
      .then(data => {
        console.log(data)
        const tempArr = {
          id: data.data.currentAgency.agencyId,
          name: data.data.currentAgency.agencyName
        }
        console.log(tempArr)
        setSelectedAgency(tempArr)
        setSelectedVehicle(data.data)
      })
    }
  }, []);

  //   useEffect(() => {
  //   if (route.params?.shipment) {
  //     const foundExist = vehicles.find(item => item.value === route.params?.shipment.product);
  //     // console.log('foundExist', foundExist)
  //     setSelectedProduct(foundExist)
  //   }
  // }, [vehicles]);

useEffect(() => {
  if(selectedAgency == null) console.log("null vehicles")
  else getVehicles();
}, [selectedAgency])

const getDestination = () => {
    fetch(`${globalApi}/locations/yards`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    // console.log(data.data)
    let destList = Object.values(data.data).flat()
//     const updatedArr = destList?.map(item => ({
//   value: item.id,
//   label: item.name,
//   town: item.town,
//   locality: item.locality
// }));

    setDestinations(destList || [])
  })
  .catch(error => console.error('Error:', error));
}

const getClients= () => {
    fetch(`${globalApi}/locations/customers`, {
  method: 'GET',
  headers: {
    'Accept': 'application/json',
    'Authorization': `Bearer ${token}`
  }
})
  .then(response => response.json())
  .then(data => {
    // console.log(data.data)
    // let destList = Object.values(data.data).flat()
//     const updatedArr = data.data?.map(item => ({
//   value: item.name, //item.id
//   label: item.name
// }));
    setClients(data.data || [])
  })
  .catch(error => console.error('Error:', error));
}

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
    // console.log(data)
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

const postNewTrip = async (payload) => {
  try {
    // console.log("payload",payload)
    const response = await fetch(`${globalApi}/shipments`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      // Throw a proper error so it’s caught by catch()
      throw new Error(data?.error?.message || 'Failed to create shipment');
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const updateNewTrip = async (payload) => {
  try {
    const response = await fetch(`${globalApi}/shipments/${route.params.shipment.id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      // Throw a proper error so it’s caught by catch()
      throw new Error(data?.error?.message || 'Failed to update shipment');
    }

    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

const putShipment = () => {
  console.log({
  "originAddress": {
    "street": "string",
    "city": route.params.source.locality,
    "state": route.params.source.town,
    "postalCode": "string",
    "country": "string"
  },
  "destinationAddress": {
    "street": "string",
    "city": selectedDestination?.locality,
    "state": selectedDestination?.town,
    "postalCode": form.photoLoaded,
    "country": "string"
  },
  "clientName": selectedClient?.name,
  "product": selectedProduct?.value,
  // "destinationType": "customer",
  "destinationId": selectedDestination?.id,
    "metadata": {
  // "volume": 200,
  // "priority": "low",
  "quantity": form.quantity,
  "tyres":form.tyres,
  // "materialId": "577272c0-df9e-473a-a2ea-ba6f3bb383ff",
  // "material_code": "COPPER_CONC",
  // "scheduled_pickup": "2024-03-20T08:00:00Z"
}
})
  updateNewTrip({
  "originAddress": {
    "street": "string",
    "city": route.params.source.locality,
    "state": route.params.source.town,
    "postalCode": "string",
    "country": "string"
  },
  "destinationAddress": {
    "street": "string",
    "city": selectedDestination?.locality,
    "state": selectedDestination?.town,
    "postalCode": form.photoLoaded,
    "country": "string"
  },
  "clientName": selectedClient?.name,
  "product": selectedProduct?.value,
  // "destinationType": "customer",
  "destinationId": selectedDestination?.id,
    "metadata": {
  // "volume": 200,
  // "priority": "low",
  "quantity": form.quantity,
  "tyres":form.tyres,
  // "materialId": "577272c0-df9e-473a-a2ea-ba6f3bb383ff",
  // "material_code": "COPPER_CONC",
  // "scheduled_pickup": "2024-03-20T08:00:00Z"
}
})
      .then((newTrip) => {
        // console.log("updated trip",newTrip)
        // addTrip(newTrip.data);
        updateTrip( newTrip.data.id , newTrip.data)
                 Alert.alert(
    "Shipment updated",
    "Your shipment has been successfully updated.",
    [
      {
        text: "OK",
        onPress: () => navigation.goBack(), // only goes back after pressing OK
      },
    ],
    { cancelable: false }
  );
      })
      .catch((err) => {
              console.error('Shipment updation failed:', err.message);
      });
}

function postShipment(){
//   for (let key in payload) {
//   if (payload.hasOwnProperty(key)) {
//     // if(form.quantity < 8){
//     //         alert(`The Quantity should be atleast 80%.`);
//     //   return
//     // }
//     //     if(!form.photoLoaded){
//     //         alert(`Please Upload Vehicle Load Photo.`);
//     //   return
//     // }
//     // Check if the value is missing (null, undefined, or an empty string)
//     if (payload[key] === null || payload[key] === undefined || payload[key] === '') {
//       alert(`The property "${key}" is missing a value.`);
//       return
//     }
//   }
// }
  const validate = () => {
    let isValid = true;
    let tempErrors = {};
        if(!form.photoLoaded){
        tempErrors['photoLoaded'] = `Photo with load is required`;
        isValid = false;
    }
        Object.keys(payload).forEach((key) => {
      // if(key === 'poNumber' ) return
      if (!payload[key]) {
        tempErrors[key] = `${key} is required`;
        isValid = false;
      }
    });
    if(0.8*form.capacity > form.quantity){
      // alert(`The Quantity should be atleast 80%.`);
      tempErrors['quantity'] = 'The Quantity should be atleast 80%'
      isValid = false
    }
    if(!selectedAgency){
        tempErrors['agency'] = `agency is required`;
        isValid = false;
    }
        if(!selectedVehicle){
        tempErrors['vehicle'] = `agency is required`;
        isValid = false;
    }
    setErrors(tempErrors);
    // console.log(tempErrors)
    return isValid;
  };

    if (!validate()) return

// console.log(payload)
postNewTrip(payload)
      .then((newTrip) => {
        // console.log("added trip",newTrip, selectedDestination)
      addTrip(newTrip.data);
//       console.log({
//   "vehicleId": selectedVehicle.id,
//   "startLocationType": getType(),
//   "startLocationId": route.params.source.id,
//   "endLocationType": "yard",
//   "endLocationId": selectedDestination.id  
// })
      fetch(`${globalApi}/shipments/${newTrip.data.id}/legs`,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
  "vehicleId": selectedVehicle.id,
  "startLocationType": getType(),
  "startLocationId": route.params.source.id,
  "endLocationType": "yard",
  "endLocationId": selectedDestination.id
})
    }).then(response => console.log(response.json()))
         Alert.alert(
    "Shipment added",
    "Your shipment has been successfully added.",
    [
      {
        text: "OK",
        onPress: () => navigation.goBack(), // only goes back after pressing OK
      },
    ],
    { cancelable: false }
  );
      })
      .catch((err) => {
              console.error('Shipment creation failed:', err.message);
      // Alert.alert(
      //   "Error",
      //   err.message || "Failed to create shipment. Please try again."
      // );
      });
}
  // Auto fill today's date
  useEffect(() => {
const today = new Date();

const pad = (num) => String(num).padStart(2, '0');

const day = pad(today.getDate());
const month = pad(today.getMonth() + 1); // Months are zero-based
const year = today.getFullYear();

const hours = pad(today.getHours());
const minutes = pad(today.getMinutes());
const seconds = pad(today.getSeconds());

const formattedDate = `${day}-${month}-${year}, ${hours}:${minutes}:${seconds}`;
    setForm((prev) => ({ ...prev, date: formattedDate, source: route.params.source.name }));
  }, []);

  useEffect(()=>{
    // console.log(selectedVehicle, "dsa", vehicles)
  // const fillData = vehicles.find(
  //   (item) => item.value === selectedVehicle
  // );
    // console.log(fillData,"fill")
    if(selectedVehicle === null) setForm((prev) => ({ ...prev, vehicleType: '', capacity: '' }));
    else 
    setForm((prev) => ({ ...prev, vehicleType: selectedVehicle.vehicleType, capacity: selectedVehicle.capacity }));
  },[selectedVehicle])

  //   useEffect(()=>{
  //   // console.log(selectedVehicle, "dsa", vehicles)
  // // const fillData = destinations.find(
  // //   (item) => item.value === selectedDestination
  // // );
  //   console.log(selectedDestination,"fill")
  //   // if(selectedVehicle === null) setForm((prev) => ({ ...prev, vehicleType: '', capacity: '' }));
  //   // else 
  //   // setForm((prev) => ({ ...prev, vehicleType: fillData.vehicleType, capacity: fillData.capacity }));
  // },[selectedDestination])


  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
    setErrors(prev => {
      const {[key]: _, ...rest} = prev;
      return rest;
    })
  };

      async function changeImage(verb) {
        const options = {
            mediaType: 'photo',
            includeBase64: false,
            maxHeight: 2000,
            maxWidth: 2000,
        };

        // console.log("function")
        const result = await launchImageLibrary(options);

        if (result.didCancel) {
            console.log('User cancelled image picker');
        } else if (result.error) {
            console.log('ImagePicker Error: ', result.error);
        } else {
            const localImagePath = result.assets[0].uri;
            if(verb == "empty") handleChange("photoEmpty",localImagePath)
            else handleChange("photoLoaded",localImagePath)
        }
    }

  return (
    <View style={[styles.container,{backgroundColor: theme.colors.background}]}>
            <View style={{flexDirection:'row',paddingVertical:10}}>
      <GoBack navigation={navigation}/>
      {/* Header */}
      { route.params?.edit ? <Text style={[styles.header,{color: theme.colors.btnBack}]}>Edit Shipment</Text> 
      :
      <Text style={[styles.header,{color: theme.colors.btnBack}]}>Add Shipment</Text>
      }
      </View>
      {/* Form */}
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* Date */}
        <Text style={[styles.label, {color: theme.colors.text}]}>Date</Text>
        <TextInput
          style={[styles.input,{color: theme.colors.secText, backgroundColor: theme.colors.card}]}
          value={form.date}
          editable={false} // auto-filled
        />

        {/* Source */}
        <Text style={[styles.label, {color: theme.colors.text}]}>Source</Text>
        <TextInput
          style={[styles.input,{color: theme.colors.secText, backgroundColor: theme.colors.card}]}
        //   placeholder="Enter Source"
        //   placeholderTextColor = {theme.colors.placeholderTxt}
          value={form.source}
        //   onChangeText={(t) => handleChange("source", t)}
          editable={false} // auto-filled
        />

                {/* Destination */}
        <Text style={[styles.label, {color: theme.colors.text}]}>Destination</Text>
        {/* <TextInput
          style={[styles.input,{color: theme.colors.secText, backgroundColor: theme.colors.card}]}
          placeholder="Enter Destination"
          placeholderTextColor = {theme.colors.placeholderTxt}
          value={form.destination}
          onChangeText={(t) => handleChange("destination", t)}
        /> */}
            <Dropdown
        data={destinations}
        keyValue={selectedDestination?.id}
        onChange={(val) => {
          setSelectedDestination(val)
    setErrors(prev => {
      const {destinationId, ...rest} = prev;
      return rest;
    })
        }}
          labelField = "name"
  valueField = "id"
        placeholder="Choose a destination"

        dropdownStyle={{
    backgroundColor: theme.colors.card,
    borderColor: errors.destinationId ? 'red' : theme.colors.border,
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
    backgroundColor: theme.colors.border
  }}
        modalContainerStyle={{
    backgroundColor: theme.colors.background,
  }} 
   arrowStyle={{
    color: theme.colors.placeholderTxt
  }}
      />
      {/* {errors.destinationId ? <Text style={styles.error}>{errors.destinationId}</Text> : null} */}
        {/* PO Number (optional) */}
        <Text style={[styles.label, {color: theme.colors.text}]}>PO Number</Text>
        <TextInput
          style={[styles.input,{color: theme.colors.secText, backgroundColor: theme.colors.card, borderWidth:1, borderColor: errors.poNumber ? 'red' : 'transparent'}]}
          placeholder="Enter PO Number"
          placeholderTextColor = {theme.colors.placeholderTxt}
          value={form.poNumber}
          onChangeText={(t) => handleChange("poNumber", t)}
        />

        {/* Invoice / Waybill */}
        <Text style={[styles.label, {color: theme.colors.text}]}>Invoice / Waybill</Text>
        <TextInput
          style={[styles.input,{color: theme.colors.secText, backgroundColor: theme.colors.card, borderWidth:1, borderColor: errors.invoice ? 'red' : 'transparent'}]}
          placeholder="Enter Invoice / Waybill"
          placeholderTextColor = {theme.colors.placeholderTxt}
          value={form.invoice}
          onChangeText={(t) => handleChange("invoice", t)}
        />
      {/* {errors.invoice ? <Text style={styles.error}>{errors.invoice}</Text> : null} */}

        {/* Royalty Waybill */}
        <Text style={[styles.label, {color: theme.colors.text}]}>Source Mine Royalty Waybill</Text>
        <TextInput
          style={[styles.input,{color: theme.colors.secText, backgroundColor: theme.colors.card, borderWidth:1, borderColor: errors.royaltyWaybill ? 'red' : 'transparent'}]}
          placeholder="Enter Royalty Waybill"
          placeholderTextColor = {theme.colors.placeholderTxt}
          value={form.royaltyWaybill}
          onChangeText={(t) => handleChange("royaltyWaybill", t)}
        />

        {/* Product */}
        <Text style={[styles.label, {color: theme.colors.text}]}>Product</Text>
        {/* <TextInput
          style={[styles.input,{color: theme.colors.secText, backgroundColor: theme.colors.card, borderWidth:1, borderColor: errors.product ? 'red' : 'transparent'}]}
          placeholder="Enter Product"
          placeholderTextColor = {theme.colors.placeholderTxt}
          value={form.product}
          onChangeText={(t) => handleChange("product", t)}
        /> */}
            <Dropdown
        data={products}
        keyValue={selectedProduct?.value}
        onChange={(val) => {
          setSelectedProduct(val)
    setErrors(prev => {
      const {product, ...rest} = prev;
      return rest;
    })
        }}
          labelField = "label"
  valueField = "value"
        placeholder="Choose a product"

        dropdownStyle={{
    backgroundColor: theme.colors.card,
    borderColor: errors.product ? 'red' : theme.colors.border,
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
    backgroundColor: theme.colors.border
  }}
        modalContainerStyle={{
    backgroundColor: theme.colors.background,
  }} 
   arrowStyle={{
    color: theme.colors.placeholderTxt
  }}
      />
        {/* Company */}
        <Text style={[styles.label, {color: theme.colors.text}]}>Client Name</Text>
                    <Dropdown
        data={clients}
        keyValue={selectedClient?.name}
        onChange={(val) => {
          setSelectedClient(val)
    setErrors(prev => {
      const {clientName, ...rest} = prev;
      return rest;
    })
        }}
          labelField = "name"
  valueField = "name"
        placeholder="Choose a client"

        dropdownStyle={{
    backgroundColor: theme.colors.card,
    borderColor: errors.clientName ? 'red' : theme.colors.border,
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
        {/* <TextInput
          style={[styles.input,{color: theme.colors.secText, backgroundColor: theme.colors.card}]}
          placeholder="Enter Client Name"
          placeholderTextColor = {theme.colors.placeholderTxt}
          value={form.clientName}
          onChangeText={(t) => handleChange("clientName", t)}
        /> */}

        <Text style={[styles.sectionTitle,{fontSize:19, color: theme.colors.text}]}>Vehicle Details</Text>
{/* <View style={{borderWidth:1,borderColor:'#aaa',padding:15,borderRadius:5}}>  */}
  {/* Vehicle Details */}

        <Text style={[styles.label, {color: theme.colors.text}]}>Agency</Text>
                    <Dropdown
        data={agencies}
        keyValue={selectedAgency?.id}
        onChange={(val)=>{
          setSelectedAgency(val)
          setSelectedVehicle(null)
              setErrors(prev => {
      const {agency, ...rest} = prev;
      return rest;
    })
        }}

  labelField = "name"
  valueField = "id"
        placeholder="Choose agency"

        dropdownStyle={{
    backgroundColor: theme.colors.card,
    borderColor: errors.agency ? 'red' : theme.colors.border,
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
      />
{ selectedAgency && <>
        <Text style={[styles.label, {color: theme.colors.text}]}>Vehicle Number</Text>
        {/* <TextInput
          style={[styles.input,{color: theme.colors.secText, backgroundColor: theme.colors.card}]}
          placeholder="Enter Vehicle Number"
          placeholderTextColor = {theme.colors.placeholderTxt}
          value={form.vehicleNumber}
          onChangeText={(t) => handleChange("vehicleNumber", t)}
        /> */}
                    <Dropdown
        data={vehicles}
        keyValue={selectedVehicle?.id}
        onChange={(val) => {
          setSelectedVehicle(val)
            setErrors(prev => {
      const {vehicle, ...rest} = prev;
      return rest;
    })
  }}
    labelField = "vehicleId"
  valueField = "id"
        placeholder="Choose vehicle"

        dropdownStyle={{
    backgroundColor: theme.colors.card,
    borderColor: errors.vehicle ? 'red' : theme.colors.border,
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
{  selectedVehicle &&  <>
        <Text style={[styles.label, {color: theme.colors.text}]}>Vehicle Type</Text>
        <TextInput
          style={[styles.input,{color: theme.colors.secText, backgroundColor: theme.colors.card}]}
          // placeholder="Enter Vehicle Type"
          // placeholderTextColor = {theme.colors.placeholderTxt}
          value={form.vehicleType}
          // onChangeText={(t) => handleChange("vehicleType", t)}
          editable={false}
        />

        <Text style={[styles.label, {color: theme.colors.text}]}>Tyres</Text>
        <TextInput
          style={[styles.input,{color: theme.colors.secText, backgroundColor: theme.colors.card}]}
          placeholder="Enter Tyres"
          placeholderTextColor = {theme.colors.placeholderTxt}
          value={form.tyres}
          onChangeText={(t) => handleChange("tyres", t)}
        />

        <Text style={[styles.label, {color: theme.colors.text}]}>Capacity</Text>
        <TextInput
          style={[styles.input,{color: theme.colors.secText, backgroundColor: theme.colors.card}]}
          // placeholder="Enter Capacity"
          // placeholderTextColor = {theme.colors.placeholderTxt}
          value={form.capacity}
          // onChangeText={(t) => handleChange("capacity", t)}
          editable={false} // auto-filled
        />

        <Text style={[styles.label, {color: theme.colors.text}]}>Quantity</Text>
        <TextInput
          style={[styles.input,{color: theme.colors.secText, backgroundColor: theme.colors.card}]}
          placeholder="Enter Quantity"
          placeholderTextColor = {theme.colors.placeholderTxt}
          value={form.quantity}
          onChangeText={(t) => handleChange("quantity", t)}
        />
        {errors.quantity && <Text style={styles.error}>{errors.quantity}</Text>}
      </>
      }
</>
}
{/* </View> */}
       
        {/* Upload Photos */}
        <Text style={[styles.sectionTitle,{color: theme.colors.text}]}>Upload Vehicle Photos</Text>
        <View style={{flexDirection:'row'}}>
                    <Text style={[styles.label,{margin:5,flex:1, color: theme.colors.text}]} onPress={() => changeImage('empty')}>Without Load</Text>
                    <Text style={[styles.label,{margin:5,flex:1, color: theme.colors.text}]} onPress={() => changeImage('load')}>With Load</Text>

        </View>
        <View style={styles.uploadContainer}>
          <TouchableOpacity style={[styles.uploadBox,{backgroundColor : theme.colors.card}]} onPress={() => changeImage('empty')}>
            {form.photoEmpty ? (
              <Image source={{ uri: form.photoEmpty }} style={styles.uploadImg} />
            ) : (
                <Image source={{uri:'https://pixsector.com/cache/d01b7e30/av7801257c459e42a24b5.png'}} style={{width:40,height:40,tintColor: theme.colors.camera}}/>
            //   <Text style={styles.uploadText}>Without Load</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={[styles.uploadBox,{backgroundColor : theme.colors.card, borderWidth:1, borderColor: errors.photoLoaded ? 'red' : 'transparent'}]} onPress={() => changeImage('load')}>
            {form.photoLoaded ? (
              <Image source={{ uri: form.photoLoaded }} style={styles.uploadImg} />
            ) : (
                                <Image source={{uri:'https://pixsector.com/cache/d01b7e30/av7801257c459e42a24b5.png'}} style={{width:40,height:40,tintColor: theme.colors.camera}}/>
            //   <Text style={styles.uploadText}>With Load</Text>
            )}
          </TouchableOpacity>
        </View>
{Object.keys(errors).length > 0 && <Text style={[styles.error,{marginTop:10,marginBottom:0}]}>Please fill all the required fields</Text>}
        {/* Submit Button */}
        <View style={{flexDirection:'row'}}>
                <TouchableOpacity style={[styles.submitBtn,{backgroundColor : theme.colors.btnBack}]} onPress={() => navigation.goBack()}>
          <Text style={styles.submitText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.submitBtn,{backgroundColor : theme.colors.btnBack}]} onPress={() => {
            // addTrip(form)
            route.params?.edit  ? putShipment() : postShipment()
            // navigation.goBack()
            }}>
          <Text style={styles.submitText}>Save</Text>
        </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddTripScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#121212",
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 16,
    // paddingBottom: 50,
  },
  header: {
    fontSize: 22,
                  paddingTop:2,
    fontWeight: "bold",
    // color: "#ff9800",
    marginVertical:Platform.OS === 'ios' ? 25 : 0,
    textAlign:"center"
  },
  error:{
    color:'red',
    marginBottom:5,
    paddingHorizontal:12
  },
  label: {
    // color: "#fff",
    marginBottom: 5,
    fontSize: 18,
    fontWeight: "500",
  },
  input: {
    // backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    // color: "#f6f6f6",
    fontSize: 16,
  },
  sectionTitle: {
    // color: "#ccc",
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  uploadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  uploadBox: {
    // backgroundColor: "#2A2A2A",
    flex: 1,
    height: 100,
    margin: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    // color: "#aaa",
    fontSize: 14,
  },
  uploadImg: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  submitBtn: {
    flex:1,
    // backgroundColor: "#ff9800",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
    margin:5
  },
  submitText: {
    color: "white",
    fontWeight: "600",
    fontSize: 18,
  },
});
