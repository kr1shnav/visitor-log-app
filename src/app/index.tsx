import { View, StyleSheet } from "react-native";
import { Button, Text, Card } from "react-native-paper";
import { router } from "expo-router";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>
        Visitor Log System
      </Text>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => router.push("/new-visitor")}
      >
        New Visitor
      </Button>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => router.push("/active-visitors")}
      >
        Active Visitors
      </Button>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => router.push("/reports")}
      >
        Reports
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },

  title: {
    marginBottom: 30,
    textAlign: "center",
    fontWeight: "bold",
  },

  button: {
    marginBottom: 15,
    paddingVertical: 5,
  },
});