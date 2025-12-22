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
  Button,
  ActivityIndicator
} from "react-native";
import GoBack from "../../components/GoBack";
import { useTrips } from "../../context/TripContext";
import LinearGradient from "react-native-linear-gradient";
const { width, height } = Dimensions.get('window');
export default function DashboardScreen({navigation}) {
  const [mines, setMines] = useState([]);
  const [yards, setYards] = useState([]);
  const [userName, setUserName] = useState("XYZ User"); // simulate API user

  const [isLoading, setIsLoading] = useState(true);
  
  const {user, globalApi, token, theme} = useTrips();
  // Simulate API call for dashboard data
  useEffect(() => {
  const getData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([getMines(), getYards()]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);  // Ensures the loading state is always turned off
    }
    };

    getData();

  }, []);

async function getMines() {
  try {
    const response = await fetch(`${globalApi}/locations/mines`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setMines(data?.data || []);
  } catch (error) {
    console.error('Error:', error);
  }
}

   async function getYards(){
  try {
    const response = await fetch(`${globalApi}/locations/yards`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    setYards(data?.data || []);
  } catch (error) {
    console.error('Error:', error);
  }
  }

const renderCard = (item, type) => {
  const iconUrl =
    type === "mine"
      ? "https://img.icons8.com/ios/100/000000/mine-cart.png"
      : "https://img.icons8.com/ios/100/000000/container-truck.png";

  const name = type === "mine" ? item.name : item.name;
  // const location = item.location;

  return (
    <View style={[styles.card,{backgroundColor: theme.colors.card}]}>
      <Image source={{ uri: iconUrl }} style={[styles.icon,{tintColor : theme.colors.btnBack}]} />
      <Text style={[styles.title,{color: theme.colors.text}]}>{name}</Text>
      {/* <Text style={styles.title}>{location}</Text> */}
      <TouchableOpacity
        style={[styles.viewButton,{backgroundColor: theme.colors.btnBack}]}
        onPress={() => navigation.navigate("TripDetails", { source: item })}
      >
        <Text style={[styles.viewButtonText]}>VIEW</Text>
      </TouchableOpacity>
    </View>
  );
};

  // if (isLoading) {
  //   return (
  //     <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
  //       <ActivityIndicator size="small" color={theme.colors.btnBack} />
  //     {/* <Text style={{color:theme.colors.text}}>Loading...</Text> */}
  //     </View>
  //   );
  // }

  return (
            
    <View style={[styles.container,{ backgroundColor: theme.colors.background}]}> 
        <View style={{flexDirection:'row'}}>
        <GoBack navigation={navigation}/>
      {/* 🔥 Header */}
      <View style={styles.header}>
        <Text style={[styles.welcomeText,{color: theme.colors.text}]}>Welcome,</Text>
        <Text style={[styles.userName,{color: theme.colors.btnBack}]}>{userName}</Text>
      </View>
</View>
      <Text style={[styles.sectionTitle,{color: theme.colors.text}]}>Mines</Text>
      <LinearGradient
      colors={[ theme.colors.btnBack, theme.colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        width: 50,
        height: 2,
  marginBottom: 10,
      }}
    >
        </LinearGradient>
{isLoading ? 
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color={theme.colors.btnBack} />
      {/* <Text style={{color:theme.colors.text}}>Loading...</Text> */}
      </View>
      :
      (mines.length === 0) ? 
<Text style={{color: theme.colors.text,margin:50,textAlign:'center'}}>No Mines Available</Text>
:
<FlatList
  data={mines}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => renderCard(item, "mine")}
  numColumns={2}
  columnWrapperStyle={{ justifyContent: "space-between" }}
  contentContainerStyle={{ paddingBottom: 20 }}
/>
}
      
<Text style={[styles.sectionTitle, {color: theme.colors.text}]}>Yards</Text>
      <LinearGradient
      colors={[theme.colors.btnBack, theme.colors.background]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={{
        width: 50,
        height: 2,
  marginBottom: 10,
      }}
    ></LinearGradient>
{isLoading ? 
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="small" color={theme.colors.btnBack} />
      {/* <Text style={{color:theme.colors.text}}>Loading...</Text> */}
      </View>
      :
      (yards.length === 0) ? 
<Text style={{color: theme.colors.text,margin:50,textAlign:'center'}}>No Yards Available</Text>
:
<FlatList
  data={yards}
  keyExtractor={(item) => item.id}
  renderItem={({ item }) => renderCard(item, "yard")}
  numColumns={2}
  columnWrapperStyle={{ justifyContent: "space-between" }}
  contentContainerStyle={{ paddingBottom: 20 }}
/>
 }
        <TouchableOpacity style={styles.exportButton} onPress={()=> navigation.navigate('reportsScreen')}>
          <Text style={styles.exportButtonText}>Reports</Text>
        </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#292929ff", // dark theme
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 15,
    paddingTop:20,
  },
  header: {
    marginVertical:Platform.OS === 'ios' ? 25 : 0,
    paddingVertical: 10,
    // alignItems:'center',
  },
  welcomeText: {
    fontSize: 16,
    // color: "#aaa",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    // color: "#ff9800", // orange highlight
    marginTop: 2,
  },
  card: {
    // backgroundColor: "#272323ff",
    borderRadius: 12,
    padding: 20,
    width:width/2 -20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    // flex: 1,
    marginHorizontal: 5,
    // elevation: 4,
    // shadowColor: "#fff",
    // shadowOffset: { width: 0, height: 2 },
    // shadowOpacity: 0.2,
    // shadowRadius: 3,
  },
  icon: {
    width: 50,
    height: 50,
    // tintColor: "#ff9800",
    marginBottom: 15,
  },
  title: {
    fontSize: 16,
    // color: "#fff",
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "600",
    height:40,
  },
  viewButton: {
    // backgroundColor: "#ff9800",
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 6,
  },
  viewButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  sectionTitle: {
  fontSize: 18,
  fontWeight: "700",
  // color: "#fff",
  marginBottom: 4,
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
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
  },

});
