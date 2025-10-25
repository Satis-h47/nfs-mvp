import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image, Dimensions,
  ImageBackground
} from "react-native";
import { launchImageLibrary } from 'react-native-image-picker';
import { useTrips } from "../../context/TripContext";
const { width, height } = Dimensions.get('window');
const AddTripScreen = ({navigation, route}) => {
    // console.log(route.params.source, "spoogf")
  const { trips, addTrip } = useTrips();
  const [form, setForm] = useState({
    id: trips.length+1,
    date: "",
    source: "",
    poNumber: "",
    destination: "",
    invoice: "",
    royaltyWaybill: "",
    product: "",
    clientName: "",
    transportVendor: "",
    vehicleNumber: "",
    vehicleType: "",
    tyres: "",
    capacity: "",
    quantity: "",
    photoEmpty: null,
    photoLoaded: null,
    action:"Pending"
  });

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
    setForm((prev) => ({ ...prev, date: formattedDate, source: route.params.source }));
  }, []);

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
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
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.header}>Add Trip</Text>

      {/* Form */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Date */}
        <Text style={styles.label}>Date</Text>
        <TextInput
          style={[styles.input, { backgroundColor: "#2A2A2A" }]}
          value={form.date}
          editable={false} // auto-filled
        />

        {/* Source */}
        <Text style={styles.label}>Source</Text>
        <TextInput
          style={styles.input}
        //   placeholder="Enter Source"
        //   placeholderTextColor="#aaa"
          value={form.source}
        //   onChangeText={(t) => handleChange("source", t)}
          editable={false} // auto-filled
        />

                {/* Destination */}
        <Text style={styles.label}>Destination</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Destination"
          placeholderTextColor="#aaa"
          value={form.destination}
          onChangeText={(t) => handleChange("destination", t)}
        />

        {/* PO Number (optional) */}
        <Text style={styles.label}>PO Number (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter PO Number"
          placeholderTextColor="#aaa"
          value={form.poNumber}
          onChangeText={(t) => handleChange("poNumber", t)}
        />

        {/* Invoice / Waybill */}
        <Text style={styles.label}>Invoice / Waybill</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Invoice / Waybill"
          placeholderTextColor="#aaa"
          value={form.invoice}
          onChangeText={(t) => handleChange("invoice", t)}
        />

        {/* Royalty Waybill */}
        <Text style={styles.label}>Source Mine Royalty Waybill</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Royalty Waybill"
          placeholderTextColor="#aaa"
          value={form.royaltyWaybill}
          onChangeText={(t) => handleChange("royaltyWaybill", t)}
        />

        {/* Product */}
        <Text style={styles.label}>Product</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Product"
          placeholderTextColor="#aaa"
          value={form.product}
          onChangeText={(t) => handleChange("product", t)}
        />

        {/* Company */}
        <Text style={styles.label}>Client Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Client Name"
          placeholderTextColor="#aaa"
          value={form.clientName}
          onChangeText={(t) => handleChange("clientName", t)}
        />

        <Text style={styles.sectionTitle}>Vehicle Details</Text>
<View style={{borderWidth:1,borderColor:'#aaa',padding:15,borderRadius:5}}> 
  {/* Vehicle Details */}

        <Text style={styles.label}>Agency</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Agency"
          placeholderTextColor="#aaa"
          value={form.agency}
          onChangeText={(t) => handleChange("agency", t)}
        />

        <Text style={styles.label}>Vehicle Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Vehicle Number"
          placeholderTextColor="#aaa"
          value={form.vehicleNumber}
          onChangeText={(t) => handleChange("vehicleNumber", t)}
        />

        <Text style={styles.label}>Vehicle Type</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Vehicle Type"
          placeholderTextColor="#aaa"
          value={form.vehicleType}
          onChangeText={(t) => handleChange("vehicleType", t)}
        />

        <Text style={styles.label}>Tyres</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Tyres"
          placeholderTextColor="#aaa"
          value={form.tyres}
          onChangeText={(t) => handleChange("tyres", t)}
        />

        <Text style={styles.label}>Capacity</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Capacity"
          placeholderTextColor="#aaa"
          value={form.capacity}
          onChangeText={(t) => handleChange("capacity", t)}
        />

        <Text style={styles.label}>Quantity</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter Quantity"
          placeholderTextColor="#aaa"
          value={form.quantity}
          onChangeText={(t) => handleChange("quantity", t)}
        />
</View>
       
        {/* Upload Photos */}
        <Text style={styles.sectionTitle}>Upload Vehicle Photos</Text>
        <View style={{flexDirection:'row'}}>
                    <Text style={[styles.label,{margin:5,flex:1}]}>Without Load</Text>
                    <Text style={[styles.label,{margin:5,flex:1}]}>With Load</Text>

        </View>
        <View style={styles.uploadContainer}>
          <TouchableOpacity style={styles.uploadBox} onPress={() => changeImage('empty')}>
            {form.photoEmpty ? (
              <Image source={{ uri: form.photoEmpty }} style={styles.uploadImg} />
            ) : (
                <Image source={{uri:'https://pixsector.com/cache/d01b7e30/av7801257c459e42a24b5.png'}} style={{width:40,height:40}}/>
            //   <Text style={styles.uploadText}>Without Load</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.uploadBox} onPress={() => changeImage('load')}>
            {form.photoLoaded ? (
              <Image source={{ uri: form.photoLoaded }} style={styles.uploadImg} />
            ) : (
                                <Image source={{uri:'https://pixsector.com/cache/d01b7e30/av7801257c459e42a24b5.png'}} style={{width:40,height:40}}/>
            //   <Text style={styles.uploadText}>With Load</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <View style={{flexDirection:'row'}}>
                <TouchableOpacity style={styles.submitBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.submitText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn} onPress={() => {
            addTrip(form)
            navigation.goBack()
            }}>
          <Text style={styles.submitText}>Submit Trip</Text>
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
    paddingBottom: 50,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ff9800",
    margin: 25,
    textAlign:"center"
  },
  label: {
    color: "#ccc",
    marginBottom: 5,
    fontSize: 13,
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#1E1E1E",
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    color: "white",
    fontSize: 14,
  },
  sectionTitle: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
  },
  uploadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  uploadBox: {
    backgroundColor: "#2A2A2A",
    flex: 1,
    height: 100,
    margin: 5,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    color: "#aaa",
    fontSize: 14,
  },
  uploadImg: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  submitBtn: {
    flex:1,
    backgroundColor: "#ff9800",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
    margin:5
  },
  submitText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
});
