// LoginScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground, Dimensions,
  Image
} from "react-native";
import { useTrips } from "../context/TripContext";
import GoBack from '../components/GoBack';

const { width, height } = Dimensions.get('window');

export default function VerificationScreen({ navigation, route }) {
    const {UpdateUser, user} = useTrips()
    // console.log("Usertghjk", user)
  const [email, setEmail] = useState(route.params.email);
//   const [sentOtp, setSentOtp] = useState(0);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [timer, setTimer] = useState(30);

  // Handle countdown timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const sendPasscode = async () => {
    // 🔹 Simulated API call
    // const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // setSentOtp(otp)
    console.log("API: Sending OTP to", email);
    setTimer(30);
  };

  const handleOtpChange = (text, index) => {
    if (text.length > 1) text = text.slice(-1); // only 1 digit
    const newOtp = [...otp];
    newOtp[index] = text;
    // console.log(otp,newOtp)
    setOtp(newOtp);

    // Move focus automatically
    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    }
  };

  const verifyLogin = async () => {
    const enteredOtp = otp.join("");
    // 🔹 Simulated API call
    console.log("API: Verifying OTP", enteredOtp);

    // if (enteredOtp === "123456") {
    //   alert("Login success!");
    navigation.navigate("SupervisorStack")
      // navigation.replace("Home");  // Navigate after login
    // } else {
    //   alert("Invalid OTP");
    // }
  };

  return (
    <View style={styles.container}>
      <View style={{position:'absolute',left:0, top:0,margin:25}}>
        <GoBack navigation={navigation}/>
      </View>
              <Image style={{width:300,height:300,position:'absolute', top:80}}  source={require('../assets/images/logo.png')}/>
        
      {/* <Text style={styles.logo}>NFS</Text> */}
      
          {/* <Text style={{ color: "#fff", fontSize: 14 }}>Otp sent to: {email}</Text> */}
        <>
          <Text style={styles.otpLabel}>Passcode</Text>
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.otpInput}
                value={digit}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={(text) => handleOtpChange(text, index)}
              />
            ))}
          </View>
          {timer > 0 ? (
            <Text style={styles.resendText}>Resend in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={sendPasscode}>
              <Text style={[styles.resendText, { color: "#ff9800" }]}>
                Resend Code
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.button} onPress={verifyLogin}>
            <Text style={styles.buttonText}>Verify & Login</Text>
          </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                        UpdateUser("Supervisor")
                        verifyLogin()
                        }}>
              <Text style={[styles.resendText, { color: "#ff9800" }]}>
                Supervisor View
              </Text>
            </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          UpdateUser("Manager")
                          verifyLogin()
                          }}>
              <Text style={[styles.resendText, { color: "#ff9800" }]}>
                Manager view
              </Text>
            </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate("DirectorDashboard")}>
              <Text style={[styles.resendText, { color: "#ff9800" }]}>
                Director view
              </Text>
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
    borderColor: "#333",
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    backgroundColor: "#111",
    marginBottom: 20,
  },
  button: {
    width: "100%",
    backgroundColor: "#ff9800",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
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
