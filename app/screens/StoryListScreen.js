import React, { useState, useEffect } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  View, // Added View for container wrapping
} from "react-native";
import { firestore } from "../../firebaseConfig"; // Assuming Firebase is correctly set up
import { collection, getDocs } from "firebase/firestore";

const StoryListScreen = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        // Query to get all stories (no filtering by author)
        const q = collection(firestore, "stories");
        const querySnapshot = await getDocs(q);
        const storyList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setStories(storyList);
      } catch (error) {
        console.error("Error fetching stories: ", error);
        Alert.alert("Error", "Could not fetch stories.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []); // Empty dependency array means this runs only once when the component mounts

  const renderStory = ({ item }) => (
    <TouchableOpacity
      style={styles.storyItem}
      onPress={() => {
        /* Navigate to story details */
      }}
    >
      <Text style={styles.storyTitle}>{item.title}</Text>
      <Text style={styles.storyContent}>
        {item.content && typeof item.content === "string"
          ? item.content.slice(0, 100) + "..."
          : "No content available"}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return <Text style={styles.loadingText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {" "}
      {/* Added View container here */}
      <FlatList
        data={stories}
        renderItem={renderStory}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f8fb", // Soft light blue background for freshness
    paddingTop: 20,
    paddingHorizontal: 15,
  },
  storyItem: {
    padding: 15,
    marginBottom: 15, // Increased marginBottom to prevent overlap
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 5, // Added vertical margin for better separation
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5, // Added margin to separate title from content
  },
  storyContent: {
    fontSize: 14,
    color: "#555",
    flexWrap: "wrap", // Ensures the text wraps within the container
    marginBottom: 10, // Added margin for better spacing
  },
  loadingText: {
    textAlign: "center",
    fontSize: 18,
    color: "#333",
  },
});

export default StoryListScreen;
