// DashboardScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ImageBackground, Dimensions,
  Button
} from "react-native";
import GoBack from "../../components/GoBack";
import { useTrips } from "../../context/TripContext";
const { width, height } = Dimensions.get('window');
export default function DashboardScreen({navigation}) {
  const [mines, setMines] = useState([]);
  const [yards, setYards] = useState([]);
  const [userName, setUserName] = useState(""); // simulate API user

  const {user} = useTrips();
  // Simulate API call for dashboard data
  useEffect(() => {
const fetchData = async () => {

const mines = [
{
    "mine_id"   : "9bd6f2e4-6750-4ff9-9123-3877c306ede5",
    "mine_name" : "Pakhar Bauxite Mines",
    "location"  : "Lohardaga - JH",
    "created_at" :"2025-09-17"

},
{
    "mine_id"   : "15f41474-f103-443c-919a-245e7c279c71",
    "mine_name" : "Kesara Bauxite Mines",
    "location"  : "Kesara - CG",
    "created_at" :"2025-09-17"

},
{
    "mine_id"   : "16741474-f103-443c-919a-245e7c279c71",
    "mine_name" : "Chirodh Bauxite Mines",
    "location"  : "Chirodh - JH",
    "created_at" :"2025-09-17"

}
]

const yards = [
{
    "yard_id"   : "0a8ab41b-f948-4a2a-b6b8-a85ba8eb5e2c",
    "yard_name" : "Yard-Chirodh",
    "location"  : "Chirodh - JH",
    "created_at" :"2025-09-17"

},
{
    "yard_id"   : "7c72c1f0-402e-432f-838a-f2a17029cb90",
    "yard_name" : "Yard-Kesara",
    "location"  : "Kesara - CG",
    "created_at" :"2025-09-17"

}
]
const data = [
  { id: "1", title: "Mine1", icon: "https://img.icons8.com/ios/100/000000/mine-cart.png" },
  { id: "2", title: "Mine2", icon: "https://img.icons8.com/ios/100/000000/mine-cart.png" },
  { id: "3", title: "Yard1", icon: "https://img.icons8.com/ios/100/000000/container-truck.png" },
  { id: "4", title: "Yard2", icon: "https://img.icons8.com/ios/100/000000/container-truck.png" },
];
      setMines(user == "Manager"  ? mines : mines.slice(0,1));
      setYards(user == "Manager"  ? yards :  yards.slice(0,1));
      setUserName(user == "Manager"  ? "Raja Babu" : "K L Mohan Rao")
    };
    fetchData();
  }, []);

const renderCard = (item, type) => {
  const iconUrl =
    type === "mine"
      ? "https://img.icons8.com/ios/100/000000/mine-cart.png"
      : "https://img.icons8.com/ios/100/000000/container-truck.png";

  const name = type === "mine" ? item.mine_name : item.yard_name;
  const location = item.location;

  return (
    <View style={styles.card}>
      <Image source={{ uri: iconUrl }} style={styles.icon} />
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.title}>{location}</Text>
      <TouchableOpacity
        style={styles.viewButton}
        onPress={() => navigation.navigate("TripDetails", { source: name })}
      >
        <Text style={styles.viewButtonText}>VIEW</Text>
      </TouchableOpacity>
    </View>
  );
};


  return (
            
    <View style={styles.container}> 
        <View style={{flexDirection:'row'}}>
        <GoBack navigation={navigation}/>
      {/* 🔥 Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Welcome,</Text>
        <Text style={styles.userName}>{userName}</Text>
      </View>
</View>
      <Text style={styles.sectionTitle}>Mines</Text>
<FlatList
  data={mines}
  keyExtractor={(item) => item.mine_id}
  renderItem={({ item }) => renderCard(item, "mine")}
  numColumns={2}
  columnWrapperStyle={{ justifyContent: "space-between" }}
  contentContainerStyle={{ paddingBottom: 20 }}
/>
      
<Text style={styles.sectionTitle}>Yards</Text>
<FlatList
  data={yards}
  keyExtractor={(item) => item.yard_id}
  renderItem={({ item }) => renderCard(item, "yard")}
  numColumns={2}
  columnWrapperStyle={{ justifyContent: "space-between" }}
  contentContainerStyle={{ paddingBottom: 20 }}
/>
 
        <TouchableOpacity style={styles.exportButton} onPress={()=> navigation.navigate('reportsScreen')}>
          <Text style={styles.exportButtonText}>Reports</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#000", // dark theme
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
  },
  header: {
    marginVertical:25,
    paddingVertical: 10,
    // alignItems:'center',
  },
  welcomeText: {
    fontSize: 16,
    color: "#aaa",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ff9800", // orange highlight
    marginTop: 2,
  },
  card: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 20,
    width:180,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    // flex: 1,
    marginHorizontal: 5,
    elevation: 4,
    shadowColor: "#fff",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  icon: {
    width: 50,
    height: 50,
    tintColor: "#ff9800",
    marginBottom: 15,
  },
  title: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
  },
  viewButton: {
    backgroundColor: "#ff9800",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  sectionTitle: {
  fontSize: 18,
  fontWeight: "700",
  color: "#fff",
  marginBottom: 10,
  marginTop: 20,
},
  exportButton: {
    backgroundColor: "#ff3d00",
    padding: 10,
    borderRadius: 10,
    // position: "absolute",
    // bottom: 20,
    alignSelf: "center",
    width: "90%",
  },
  exportButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600",
  },

});
