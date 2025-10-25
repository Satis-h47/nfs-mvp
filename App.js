// App.js
import React, { useState, createContext, useContext } from "react";
import { View, Text, Button, TextInput, FlatList } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./src/screens/LoginScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import VerificationScreen from "./src/screens/VerificationScreen";
import DashboardScreen from "./src/screens/Supervisor/DashboardScreen";
import TripDetailsScreen from "./src/screens/Supervisor/TripDetailsScreen";
import AddTripScreen from "./src/screens/Supervisor/AddTripScreen";
import { TripProvider } from "./src/context/TripContext";
import TripModal from "./src/screens/Supervisor/TripModal";
import withBackground from "./src/components/withBackground"
import Reports from './src/screens/Reports'
import DirectorDashboard from './src/screens/Director/DirectorDashboard'
import DetailedShipmentReport from './src/screens/Director/DetailedShipmentReport'

const Stack = createNativeStackNavigator();

function Login({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Select Role</Text>
      <Button title="Login as Supervisor" onPress={() => navigation.navigate("SupervisorStack")} />
      <Button title="Login as Manager" onPress={() => navigation.navigate("ManagerStack")} />
    </View>
  );
}

// ===== Supervisor Screens =====
function SupervisorHome({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Create Trip" onPress={() => navigation.navigate("CreateTrip")} />
      <Button title="View Trips" onPress={() => navigation.navigate("SupervisorTrips")} />
    </View>
  );
}

function CreateTrip({ navigation }) {
  const { addTrip } = useTrips();
  const [vehicle, setVehicle] = useState("");

  const handleSubmit = () => {
    const newTrip = {
      id: Date.now().toString(),
      vehicle,
      status: "Pending",
    };
    addTrip(newTrip);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text>Enter Vehicle Number</Text>
      <TextInput
        placeholder="e.g. MH12AB1234"
        value={vehicle}
        onChangeText={setVehicle}
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />
      <Button title="Submit Trip" onPress={handleSubmit} />
    </View>
  );
}

function SupervisorTrips() {
  const { trips } = useTrips();
  return (
    <FlatList
      data={trips}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text>Vehicle: {item.vehicle}</Text>
          <Text>Status: {item.status}</Text>
        </View>
      )}
    />
  );
}

// ===== Manager Screens =====
function ManagerHome({ navigation }) {
  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Review Trips" onPress={() => navigation.navigate("ManagerTrips")} />
    </View>
  );
}

function ManagerTrips() {
  const { trips, updateTrip } = useTrips();
  const pendingTrips = trips.filter((t) => t.status === "Pending");

  return (
    <FlatList
      data={pendingTrips}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={{ padding: 10, borderBottomWidth: 1 }}>
          <Text>Vehicle: {item.vehicle}</Text>
          <Button title="Approve" onPress={() => updateTrip(item.id, { status: "Approved" })} />
          <Button title="Reject" onPress={() => updateTrip(item.id, { status: "Rejected" })} />
        </View>
      )}
    />
  );
}

// ===== Navigation Setup =====
function SupervisorStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SupervisorHome" component={SupervisorHome} />
      <Stack.Screen name="CreateTrip" component={CreateTrip} />
      <Stack.Screen name="SupervisorTrips" component={SupervisorTrips} />
    </Stack.Navigator>
  );
}

function ManagerStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ManagerHome" component={ManagerHome} />
      <Stack.Screen name="ManagerTrips" component={ManagerTrips} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <TripProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          {/* <Stack.Screen 
            name="Welcome"
            component={WelcomeScreen} 
            options={{ headerShown: false }}
          /> */}
          <Stack.Screen 
            name="Login"
            component={withBackground(LoginScreen)} 
            options={{ headerShown: false }}
          />
            <Stack.Screen 
            name="Verification"
            component={withBackground(VerificationScreen)} 
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SupervisorStack"
            component={withBackground(DashboardScreen)}
            options={{ headerShown: false }}
          />
            <Stack.Screen
            name="TripDetails"
            component={withBackground(TripDetailsScreen)}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="AddTrip"
            component={withBackground(AddTripScreen)}
            options={{ headerShown: false }}
          />
           <Stack.Screen
            name="TripModal"
            component={TripModal}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DirectorDashboard"
            component={withBackground(DirectorDashboard)}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="DetailedShipmentReport"
            component={withBackground(DetailedShipmentReport)}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="reportsScreen"
            component={withBackground(Reports)}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="ManagerStack"
            component={ManagerStack}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </TripProvider>
  );
}
