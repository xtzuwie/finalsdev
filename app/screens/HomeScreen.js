import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  RefreshControl,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from "react-native";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { firestore, auth } from "../../firebaseConfig";
import Icon from "react-native-vector-icons/Feather";
import axios from "axios";

const { width, height } = Dimensions.get("window");

const HomeScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [userEmail, setUserEmail] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [books, setBooks] = useState([]);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [stories, setStories] = useState([]);
  const [loadingStories, setLoadingStories] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserEmail(user.email);
      } else {
        setUserEmail(null);
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const fetchStories = async () => {
      try {
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
        setLoadingStories(false);
      }
    };

    fetchStories();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Alert.alert("Success", "You have been logged out.");
        navigation.replace("LoginScreen");
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  const fetchBooks = async () => {
    if (!query.trim()) return;

    setIsLoading(true);
    const API_KEY = "Your Google Books API"; // Replace with your API key
    const API_URL = `https://www.googleapis.com/books/v1/volumes?q=${query}&key=${API_KEY}`;

    try {
      const response = await axios.get(API_URL);
      setBooks(response.data.items || []);
    } catch (error) {
      console.error("Error fetching books:", error);
      Alert.alert("Error", "Failed to fetch books. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderBookCard = (item, index) => {
    const book = item.volumeInfo;
    return (
      <TouchableOpacity
        key={index}
        style={styles.bookCard}
        onPress={() => navigation.navigate("BookDetails", { book })}
      >
        <View style={styles.bookCardImageContainer}>
          <Image
            style={styles.thumbnail}
            source={{
              uri:
                book.imageLinks?.thumbnail ||
                "https://via.placeholder.com/150x220",
            }}
            resizeMode="cover"
          />
        </View>
        <View style={styles.bookCardTextContainer}>
          <Text style={styles.bookTitle} numberOfLines={2}>
            {book.title || "No Title"}
          </Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>
            {book.authors ? book.authors.join(", ") : "Unknown Author"}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

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

  return (
    <View style={styles.container}>
      {/* Sidebar */}
      {isSidebarVisible && (
        <View style={styles.sidebar}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsSidebarVisible(false)}
          >
            <Icon name="x" size={24} color="white" />
          </TouchableOpacity>

          <View style={styles.userProfile}>
            <Icon name="user" size={50} color="white" />
            <Text style={styles.sidebarText}>{userEmail || "Guest User"}</Text>
          </View>

          <View style={styles.sidebarActions}>
            <TouchableOpacity
              style={styles.sidebarActionButton}
              onPress={handleLogout}
            >
              <Icon name="log-out" size={20} color="white" />
              <Text style={styles.sidebarActionText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.sidebarActionButton}
              onPress={() => navigation.navigate("WriteStoryScreen")}
            >
              <Icon name="edit" size={20} color="white" />
              <Text style={styles.sidebarActionText}>Write a Story</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.header}>
        <TouchableOpacity onPress={() => setIsSidebarVisible(true)}>
          <Icon name="menu" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>WeBook</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Icon
            name="search"
            size={20}
            color="#888"
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search books..."
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={fetchBooks}
          />
        </View>
      </View>

      {isLoading ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={styles.loadingIndicator}
        />
      ) : books.length === 0 ? (
        <View style={styles.emptyStateContainer}>
          <Icon name="book" size={50} color="#ccc" />
          <Text style={styles.emptyStateText}>
            No books found. Try a different search.
          </Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.booksContainer}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchBooks()}
            />
          }
        >
          {books.map(renderBookCard)}
        </ScrollView>
      )}

      <Text style={styles.sectionTitle}>Published Stories</Text>
      {loadingStories ? (
        <ActivityIndicator
          size="large"
          color="#007bff"
          style={styles.loadingIndicator}
        />
      ) : (
        <FlatList
          data={stories}
          renderItem={renderStory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.storiesContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: "transparent",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 15,
    color: "#333",
  },
  sidebar: {
    position: "absolute",
    top: 0,
    left: 0,
    bottom: 0,
    width: width * 0.75,
    backgroundColor: "rgba(0, 123, 255, 0.9)",
    zIndex: 100,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
  },
  userProfile: {
    alignItems: "center",
    marginBottom: 30,
  },
  sidebarText: {
    color: "white",
    fontSize: 18,
    marginTop: 10,
    fontWeight: "600",
  },
  sidebarActions: {
    marginTop: 20,
  },
  sidebarActionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: 15,
    borderRadius: 10,
  },
  sidebarActionText: {
    color: "white",
    marginLeft: 15,
    fontSize: 16,
  },
  searchContainer: {
    paddingHorizontal: 15,
    marginVertical: 15,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchIcon: {
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: "#333",
  },
  booksContainer: {
    paddingHorizontal: 10,
  },
  bookCard: {
    width: width * 0.4,
    marginHorizontal: 10,
    borderRadius: 15,
    backgroundColor: "white",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    overflow: "hidden",
  },
  bookCardImageContainer: {
    height: height * 0.3,
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    width: "100%",
    height: "100%",
  },
  bookCardTextContainer: {
    padding: 10,
    backgroundColor: "white",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#666",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    marginTop: 15,
    fontSize: 18,
    color: "#888",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 15,
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  storiesContainer: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  storyItem: {
    padding: 15,
    marginBottom: 15,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 5,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  storyContent: {
    fontSize: 14,
    color: "#555",
    flexWrap: "wrap",
    marginBottom: 10,
  },
});

export default HomeScreen;
