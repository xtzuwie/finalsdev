import React, { useState, useEffect } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Switch } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ref, onValue, set } from "firebase/database";
import { rtdb } from "../../firebaseConfig";

function AboutScreen() {
  const navigation = useNavigation();
  const [value, setValue] = useState(0);
  const [darkMode, setDarkMode] = useState(true); // Dark mode state

  useEffect(() => {
    const valueRef = ref(rtdb, "value");
    const unsubscribe = onValue(valueRef, (snapshot) => {
      setValue(snapshot.val() ?? 0);
    });
    return () => unsubscribe();
  }, []);

  const handlePlus = async () => {
    try {
      const valueRef = ref(rtdb, "value");
      await set(valueRef, value + 1);
    } catch (error) {
      console.error("Failed to update value:", error);
    }
  };

  const handleMinus = () => {
    const valueRef = ref(rtdb, "value");
    set(valueRef, value - 1);
  };

  const toggleDarkMode = () => setDarkMode((prevMode) => !prevMode);

  const theme = darkMode ? styles.dark : styles.light;

  return (
    <View style={[styles.container, theme.container]}>
      <View style={[styles.countContainer, theme.countContainer]}>
        <Text style={[styles.countText, theme.text]}>Counter </Text>
        <Text style={[styles.value, theme.text]}>{value}</Text>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, theme.button]}
            onPress={handleMinus}
          >
            <Text style={[styles.countText, theme.text]}>-</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, theme.button]}
            onPress={handlePlus}
          >
            <Text style={[styles.countText, theme.text]}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.navContainer}>
        <TouchableOpacity
          style={[styles.navButton, theme.button]}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text style={[styles.navButtonText, theme.text]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.navButton, theme.button]}
          onPress={() => navigation.navigate("LoginScreen")}
        >
          <Text style={[styles.navButtonText, theme.text]}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.switchContainer}>
        <Text style={[styles.switchText, theme.text]}>Dark Mode</Text>
        <Switch value={darkMode} onValueChange={toggleDarkMode} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  countContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  countText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "System",
  },
  value: {
    fontSize: 80,
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "System",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 15,
    marginHorizontal: 10,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 5,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    borderRadius: 2,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 2,
  },
  navButton: {
    flex: 1,
    marginHorizontal: 10,
    paddingVertical: 15,
    borderRadius: 10,
  },
  navButtonText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  switchContainer: {
    position: "absolute",
    top: 50,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  switchText: {
    fontSize: 16,
    marginRight: 10,
  },

  // Light Theme
  light: {
    container: {
      backgroundColor: "#f9f9f9",
    },
    countContainer: {
      backgroundColor: "#ffffff",
    },
    button: {
      backgroundColor: "#d4d4d4",
    },
    text: {
      color: "#00008b",
    },
  },

  // Dark Theme
  dark: {
    container: {
      backgroundColor: "#121212",
    },
    countContainer: {
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
    button: {
      backgroundColor: "#1E1E1E",
    },
    text: {
      color: "#ffffff",
    },
  },
});

export default AboutScreen;
