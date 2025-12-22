// LoginScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground, Dimensions,
  Image
} from "react-native";
import BackgroundWrapper from '../components/BackgroundWrapper'
import { useTrips } from "../context/TripContext";
const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const {theme} = useTrips();

  const sendPasscode = async () => {
    // 🔹 Simulated API call
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // setSentOtp(otp)
    navigation.navigate("Verification",{email: email})
    // console.log("API: Sending OTP to", email);
  };

  return (
    <View style={styles.container}>
        <Image style={{width:300,height:300,position:'absolute', top:80}}  source={require('../assets/images/logo.png')}/>
      {/* <Text style={styles.logo}>NFS</Text> */}
        <>
          <TextInput
            placeholder="Email Address"
            value={email}
            onChangeText={setEmail}
            style={[styles.input,{backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border}]}
            placeholderTextColor={theme.colors.placeholderTxt}
          />
          <TouchableOpacity style={[styles.button,{backgroundColor: theme.colors.btnBack}]} onPress={sendPasscode}>
            <Text style={styles.buttonText}>Send Passcode</Text>
          </TouchableOpacity>
        </>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#000",
    // backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  logo: {
    fontSize: 40,
    color: "#fff",
    marginBottom: 40,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    // borderColor: "#333",
    borderRadius: 8,
    padding: 15,
    // color: "#fff",
    fontSize:18,
    // backgroundColor: "#111",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    // backgroundColor: "#ff9800",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
  otpLabel: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
    marginTop: 50,
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
    marginBottom: 15,
  },
  otpInput: {
    width: 45,
    height: 55,
    borderWidth: 1,
    borderColor: "#333",
    backgroundColor: "#111",
    color: "#fff",
    textAlign: "center",
    fontSize: 20,
    borderRadius: 8,
  },
  resendText: {
    color: "#aaa",
    marginBottom: 20,
  },
  helpText: {
    color: "#aaa",
    marginTop: 30,
    fontSize: 12,
  },
});
