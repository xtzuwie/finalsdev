import React from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { WebView } from "react-native-webview";

const ReadBookScreen = ({ route }) => {
  const { url } = route.params;

  const injectedJS = `
    var meta = document.createElement('meta'); 
    meta.setAttribute('name', 'viewport'); 
    meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0'); 
    document.getElementsByTagName('head')[0].appendChild(meta);
  `;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: url }}
        scalesPageToFit={true}
        javaScriptEnabled={true}
        injectedJavaScript={injectedJS}
        startInLoadingState={true}
        renderLoading={() => (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f5eb",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ReadBookScreen;
