import React, { useState } from "react";
import {
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  View,
} from "react-native";
import { firestore, auth } from "../../firebaseConfig"; // Assuming Firebase is correctly set up
import { collection, addDoc } from "firebase/firestore";

const WriteStoryScreen = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSaveStory = async () => {
    if (title && content) {
      try {
        const user = auth.currentUser;
        if (user) {
          await addDoc(collection(firestore, "stories"), {
            title: title,
            content: content,
            author: user.email, // Store email of the author
            createdAt: new Date(),
          });
          Alert.alert("Success", "Story saved successfully!");
          navigation.goBack(); // Go back to previous screen
        }
      } catch (error) {
        console.error("Error adding story: ", error);
        Alert.alert("Error", "There was an issue saving the story.");
      }
    } else {
      Alert.alert("Error", "Title and content are required.");
    }
  };

  return (
    <View style={styles.container}>
      {" "}
      {/* Replaced div with View */}
      <TextInput
        style={styles.input}
        placeholder="Story Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Write your story here..."
        multiline
        value={content}
        onChangeText={setContent}
      />
      <TouchableOpacity style={styles.button} onPress={handleSaveStory}>
        <Text style={styles.buttonText}>Save Story</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 20,
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 15,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 200,
    textAlignVertical: "top",
  },
  button: {
    backgroundColor: "#1e90ff",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default WriteStoryScreen;
