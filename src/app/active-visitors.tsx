import React, { useState } from "react";

import {
  View,
  FlatList,
  StyleSheet,
  Alert,
  Image,
} from "react-native";

import {
  Card,
  Text,
  Button,
  Chip,
} from "react-native-paper";

type Visitor = {
  id: string;
  fullName: string;
  companyName: string;
  designation: string;
  inTime: string;
  status: "ACTIVE" | "CHECKED_OUT";
  image?: string;
};

export default function ActiveVisitorsScreen() {
  const [visitors, setVisitors] = useState<Visitor[]>([
    {
      id: "1",
      fullName: "John Doe",
      companyName: "ABC Pvt Ltd",
      designation: "Manager",
      inTime: "10:30 AM",
      status: "ACTIVE",
      image:
        "https://i.pravatar.cc/150?img=1",
    },

    {
      id: "2",
      fullName: "Jane Smith",
      companyName: "XYZ Solutions",
      designation: "Consultant",
      inTime: "11:15 AM",
      status: "ACTIVE",
      image:
        "https://i.pravatar.cc/150?img=2",
    },
  ]);

  const handleCheckout = (id: string) => {
    const updatedVisitors = visitors.map(
      (visitor) => {
        if (visitor.id === id) {
          return {
            ...visitor,
            status: "CHECKED_OUT",
          };
        }

        return visitor;
      }
    );

    setVisitors(updatedVisitors);

    Alert.alert(
      "Checked Out",
      "Visitor checked out successfully."
    );
  };

  const renderVisitor = ({
    item,
  }: {
    item: Visitor;
  }) => (
    <Card style={styles.card}>
      <Card.Content>

        <View style={styles.row}>

          <Image
            source={{ uri: item.image }}
            style={styles.image}
          />

          <View style={styles.infoContainer}>

            <Text variant="titleMedium">
              {item.fullName}
            </Text>

            <Text>
              {item.companyName}
            </Text>

            <Text>
              {item.designation}
            </Text>

            <Text>
              IN: {item.inTime}
            </Text>

            <Chip
              style={
                item.status === "ACTIVE"
                  ? styles.activeChip
                  : styles.checkoutChip
              }
            >
              {item.status}
            </Chip>

          </View>
        </View>

        {item.status === "ACTIVE" && (
          <Button
            mode="contained"
            style={styles.checkoutButton}
            onPress={() =>
              handleCheckout(item.id)
            }
          >
            CHECK OUT
          </Button>
        )}

      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={visitors}
        keyExtractor={(item) => item.id}
        renderItem={renderVisitor}
        contentContainerStyle={{
          paddingBottom: 20,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F8FAFC",
  },

  card: {
    marginBottom: 16,
    borderRadius: 12,
  },

  row: {
    flexDirection: "row",
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },

  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },

  activeChip: {
    marginTop: 10,
    alignSelf: "flex-start",
  },

  checkoutChip: {
    marginTop: 10,
    alignSelf: "flex-start",
  },

  checkoutButton: {
    marginTop: 20,
  },
});