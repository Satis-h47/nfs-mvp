import React, { useEffect, useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { Camera, useCameraDevice } from "react-native-vision-camera";

export default function CameraTestScreen() {
  const [hasPermission, setHasPermission] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [photo, setPhoto] = useState(null);
  const device = useCameraDevice("back");
  const cameraRef = useRef(null);

  // Request permissions
  useEffect(() => {
    (async () => {
      const cameraPermission = await Camera.requestCameraPermission();
      if (cameraPermission === "granted") {
        setHasPermission(true);
      } else {
        console.warn("Camera permission not granted");
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef.current == null) return;

    try {
      const photo = await cameraRef.current.takePhoto({
        flash: "off", // or 'on' / 'auto'
      });
      // console.log("Photo captured:", photo);
      setPhoto(photo);
      setIsActive(false); // Stop camera preview after capture
    } catch (e) {
      console.error("Failed to take photo:", e);
    }
  };

  if (device == null) return <Text style={styles.message}>No camera device found</Text>;

  return (
    <View style={styles.container}>
      {hasPermission && isActive ? (
        <>
          <Camera
            ref={cameraRef}
            style={StyleSheet.absoluteFill}
            device={device}
            isActive={true}
            photo={true}
          />

          {/* Shutter button */}
          <View style={styles.shutterContainer}>
            <TouchableOpacity style={styles.shutterButton} onPress={takePicture} />
          </View>
        </>
      ) : photo ? (
        <View style={styles.center}>
          <Image
            source={{ uri: `file://${photo.path}` }}
            style={{ width: 300, height: 400, borderRadius: 10 }}
          />
          <TouchableOpacity
            style={[styles.button, { marginTop: 20 }]}
            onPress={() => setIsActive(true)}
          >
            <Text style={styles.buttonText}>Retake</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.center}>
          <Text style={styles.message}>
            {hasPermission ? "Camera ready" : "Waiting for permission..."}
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsActive(true)}
          >
            <Text style={styles.buttonText}>Open Camera</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  message: { color: "#fff", fontSize: 16, marginBottom: 20 },
  button: {
    backgroundColor: "#ff9800",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  shutterContainer: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    alignItems: "center",
  },
  shutterButton: {
    width: 70,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "#ccc",
  },
});
