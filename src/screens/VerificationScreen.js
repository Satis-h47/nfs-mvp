// LoginScreen.js
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground, Dimensions,
  Image,
  Button
} from "react-native";
import { useTrips } from "../context/TripContext";
import GoBack from '../components/GoBack';

const { width, height } = Dimensions.get('window');

export default function VerificationScreen({ navigation, route }) {
    const {UpdateUser, user, UpdateToken, theme, toggleTheme} = useTrips()
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
    // console.log("API: Sending OTP to", email);
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
    // console.log("API: Verifying OTP", enteredOtp);

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
      <View style={{position:'absolute',alignItems:'center', left:0, top:0,width: width-30, flexDirection:'row',justifyContent:'space-between',marginVertical:45,marginHorizontal:15}}>
      <View style={{flexDirection:'row'}}>
        <GoBack navigation={navigation}/>
        <Text onPress={() => navigation.goBack()}
                        style={{
                  fontSize: 20,
                  paddingTop:2,
                  fontWeight: "bold",
                  color: theme.colors.btnBack,
                  textAlign:'center',
                  zIndex:20,
                  marginVertical:Platform.OS === 'ios' ? 25 : 0
                }}
                >Back</Text>
      </View>
                          <TouchableOpacity onPress={toggleTheme} activeOpacity={0.8}>
      <View
        style={[
          styles.toggle,
          { backgroundColor: theme.dark ? '#444' : 'lightblue' }
        ]}
      >
        <View
          style={[
            styles.circle,
            { alignSelf: theme.dark ? 'flex-end' : 'flex-start' }
          ]}
        />
      </View>
    </TouchableOpacity>
      </View>
              <Image style={{width:300,height:300,position:'absolute', top:80}}  source={require('../assets/images/logo.png')}/>
        
      {/* <Text style={styles.logo}>NFS</Text> */}
      
          {/* <Text style={{ color: "#fff", fontSize: 14 }}>Otp sent to: {email}</Text> */}
        <>
          <Text style={[styles.otpLabel,{color: theme.colors.thirdTxt}]}>Passcode</Text>

          <View style={styles.otpContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[styles.otpInput,{backgroundColor: theme.colors.card,borderColor: theme.colors.border, color: theme.colors.text}]}
                value={digit}
                keyboardType="numeric"
                maxLength={1}
                onChangeText={(text) => handleOtpChange(text, index)}
              />
            ))}
          </View>
          {timer > 0 ? (
            <Text style={[styles.resendText,{color: theme.colors.thirdTxt}]}>Resend in {timer}s</Text>
          ) : (
            <TouchableOpacity onPress={sendPasscode}>
              <Text style={[styles.resendText, { color: theme.colors.thirdTxt}]}>
                Resend Code
              </Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity disabled style={[styles.button,{backgroundColor: theme.colors.btnBack}]} onPress={verifyLogin}>
            <Text style={[styles.buttonText]}>Verify & Login</Text>
          </TouchableOpacity>
                      <TouchableOpacity onPress={() => {
                          UpdateUser("Supervisor")
                        UpdateToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJrdW5jaGFyYW0xQHRyYW5kYXN5cy5jb20iLCJlbWFpbCI6Imt1bmNoYXJhbTFAdHJhbmRhc3lzLmNvbSIsImdpdmVuX25hbWUiOiJyYW0xIiwiZmFtaWx5X25hbWUiOiJrdW5jaGFzMSIsImNvZ25pdG86Z3JvdXBzIjpbIlJlZ2lvbmFsIE1hbmFnZXIiXSwiY29nbml0bzp1c2VybmFtZSI6Imt1bmNoYXNkZkB0cmFuZGFzeXMuY29tIiwiY3VzdG9tOmVudGl0eUFzc2lnbm1lbnRzIjoiW3tcImVudGl0eUlkXCI6XCJmNjVhMzMwZi1jNzIyLTQwMmEtOGU1YS0wNzliYWJiMWE4NDZcIixcImVudGl0eVR5cGVcIjpcIm9yZ2FuaXphdGlvblwiLFwiYWNjZXNzTGV2ZWxcIjpcIkFETUlOXCJ9XSIsImN1c3RvbTppc1N1cGVyQWRtaW4iOiJmYWxzZSIsImlzcyI6Imh0dHBzOi8vY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb20vdXMtZWFzdC0xXzEyMzQ1Njc4OSIsImF1ZCI6IjEyMzQ1Njc4OWFiY2RlZiIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3NjYzNzk4NjcsImV4cCI6MTc2NjQ2NjI2NywiaWF0IjoxNzY2Mzc5ODY3fQ.X0PfDOElM7owPmNdFcEMKiAfqBAoU47R9Mv4sretNkY")
                        verifyLogin()
                        }}>
              <Text style={[styles.resendText, { color: theme.colors.thirdTxt }]}>
                Supervisor 1
              </Text>
            </TouchableOpacity>
                                  <TouchableOpacity onPress={() => {
                          UpdateUser("Supervisor")
                        UpdateToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhbnV0cmFAdHJhbmRhc3lzLmNvbSIsImVtYWlsIjoiYW51dHJhQHRyYW5kYXN5cy5jb20iLCJnaXZlbl9uYW1lIjoiYW51IiwiZmFtaWx5X25hbWUiOiJ0cmEiLCJjb2duaXRvOmdyb3VwcyI6WyJSZWdpb25hbCBNYW5hZ2VyIl0sImNvZ25pdG86dXNlcm5hbWUiOiJhbnV0cmFAdHJhbmRhc3lzLmNvbSIsImN1c3RvbTplbnRpdHlBc3NpZ25tZW50cyI6Ilt7XCJlbnRpdHlJZFwiOlwiZjY1YTMzMGYtYzcyMi00MDJhLThlNWEtMDc5YmFiYjFhODQ2XCIsXCJlbnRpdHlUeXBlXCI6XCJvcmdhbml6YXRpb25cIixcImFjY2Vzc0xldmVsXCI6XCJBRE1JTlwifV0iLCJjdXN0b206aXNTdXBlckFkbWluIjoiZmFsc2UiLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL3VzLWVhc3QtMV8xMjM0NTY3ODkiLCJhdWQiOiIxMjM0NTY3ODlhYmNkZWYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzY2Mzc5Nzk4LCJleHAiOjE3NjY0NjYxOTgsImlhdCI6MTc2NjM3OTc5OH0.-UW9iamv_-8do6mKE9GhV7lpzO4G6LYYawczuPkIwwk")
                        verifyLogin()
                        }}>
              <Text style={[styles.resendText, { color: theme.colors.thirdTxt }]}>
                Supervisor 2
              </Text>
            </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          UpdateUser("Manager")
                          UpdateToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1cy1lYXN0LTFfbG9jYWxzdGFjazphZG1pbi11c2VyLTAwMSIsImVtYWlsIjoiYWRtaW5AdHJhbmRhc3lzLmNvbSIsImdpdmVuX25hbWUiOiJTeXN0ZW0iLCJmYW1pbHlfbmFtZSI6IkFkbWluaXN0cmF0b3IiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbmlzdHJhdG9ycyJdLCJjb2duaXRvOnVzZXJuYW1lIjoiYWRtaW5AdHJhbmRhc3lzLmNvbSIsImN1c3RvbTplbnRpdHlBc3NpZ25tZW50cyI6IltdIiwiY3VzdG9tOmlzU3VwZXJBZG1pbiI6InRydWUiLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL3VzLWVhc3QtMV8xMjM0NTY3ODkiLCJhdWQiOiIxMjM0NTY3ODlhYmNkZWYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzY2Mzc4MTc5LCJleHAiOjE3NjY0NjQ1NzksImlhdCI6MTc2NjM3ODE3OX0.IScH9XippNIblPvKBNpJDwtO9EG8KAJw6nD999jSAnw")
                          verifyLogin()
                          }}>
              <Text style={[styles.resendText, { color: theme.colors.thirdTxt}]}>
                Manager view
              </Text>
            </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                          // UpdateToken('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1cy1lYXN0LTFfbG9jYWxzdGFjazphZG1pbi11c2VyLTAwMSIsImVtYWlsIjoiYWRtaW5AdHJhbmRhc3lzLmNvbSIsImdpdmVuX25hbWUiOiJTeXN0ZW0iLCJmYW1pbHlfbmFtZSI6IkFkbWluaXN0cmF0b3IiLCJjb2duaXRvOmdyb3VwcyI6WyJBZG1pbmlzdHJhdG9ycyJdLCJjb2duaXRvOnVzZXJuYW1lIjoiYWRtaW5AdHJhbmRhc3lzLmNvbSIsImN1c3RvbTplbnRpdHlBc3NpZ25tZW50cyI6IltdIiwiY3VzdG9tOmlzU3VwZXJBZG1pbiI6InRydWUiLCJpc3MiOiJodHRwczovL2NvZ25pdG8taWRwLnVzLWVhc3QtMS5hbWF6b25hd3MuY29tL3VzLWVhc3QtMV8xMjM0NTY3ODkiLCJhdWQiOiIxMjM0NTY3ODlhYmNkZWYiLCJ0b2tlbl91c2UiOiJhY2Nlc3MiLCJzY29wZSI6ImF3cy5jb2duaXRvLnNpZ25pbi51c2VyLmFkbWluIiwiYXV0aF90aW1lIjoxNzYyODUwMjY2LCJleHAiOjE3NjI5MzY2NjYsImlhdCI6MTc2Mjg1MDI2Nn0.vbwQWrGTOC2D6e8ecYYMST0-9cEDJxXXTCE5H0LQlMo')
                          navigation.navigate("DirectorDashboard")}
                          }>
              <Text style={[styles.resendText, { color: theme.colors.thirdTxt }]}>
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
    // color: "#fff",
    marginBottom: 10,
    marginTop: 80,
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
    // borderColor: "#333",
    // backgroundColor: "#111",
    // color: "#fff",
    textAlign: "center",
    fontSize: 20,
    borderRadius: 8,
  },
  resendText: {
    // color: "#aaa",
    marginBottom: 20,
    fontSize: 16,
  },
  helpText: {
    color: "#aaa",
    marginTop: 30,
    fontSize: 12,
  },
    toggle: {
    width: 50,
    height: 28,
    borderRadius: 20,
    padding: 3,
    justifyContent: 'center',
  },
  circle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#fff',
  },
});
