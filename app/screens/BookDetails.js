import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Button,
  Alert,
} from "react-native";

const BookDetailsScreen = ({ route, navigation }) => {
  const { book } = route.params;

  const handleReadBook = () => {
    if (book.previewLink) {
      navigation.navigate("ReadBookScreen", { url: book.previewLink });
    } else {
      Alert.alert(
        "Not Available",
        "This book does not have a preview available."
      );
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.detailsContainer}>
      <Image
        style={styles.detailsThumbnail}
        source={{
          uri:
            book.imageLinks?.thumbnail || "https://via.placeholder.com/200x300",
        }}
      />
      <Text style={styles.detailsTitle}>{book.title}</Text>
      <Text style={styles.detailsAuthor}>
        {book.authors ? book.authors.join(", ") : "Unknown Author"}
      </Text>
      <Text style={styles.detailsDescription}>
        {book.description || "No description available."}
      </Text>
      <View style={styles.buttonContainer}>
        <Button title="Preview Book" onPress={handleReadBook} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    padding: 20,
    backgroundColor: "#f9f5eb",
    alignItems: "center",
  },
  detailsThumbnail: {
    width: 200,
    height: 300,
    resizeMode: "cover",
    marginBottom: 20,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 10,
  },
  detailsAuthor: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  detailsDescription: {
    fontSize: 16,
    textAlign: "justify",
    lineHeight: 24,
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
    width: "100%",
    paddingHorizontal: 10,
  },
});

export default BookDetailsScreen;
