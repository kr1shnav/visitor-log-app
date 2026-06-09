import React from "react";

import {
  View,
  FlatList,
  StyleSheet,
  Image,
} from "react-native";

import {
  Card,
  Text,
  Button,
  Chip,
} from "react-native-paper";

import {
  useVisitor,
} from "../context/VisitorContext";

export default function ActiveVisitorsScreen() {
  const {
    visitors,
    checkoutVisitor,
  } = useVisitor();

  const renderVisitor = ({
    item,
  }: {
    item: any;
  }) => (
    <Card style={styles.card}>
      <Card.Content>

        <View style={styles.row}>

          {/* Visitor Image */}
          <Image
            source={{
              uri:
                item.image ||
                "https://via.placeholder.com/150",
            }}
            style={styles.image}
          />

          {/* Visitor Info */}
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
              Mobile: {item.mobileNo}
            </Text>

            <Text>
              IN: {item.inTime}
            </Text>

            {/* Status */}
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

        {/* Checkout Button */}
        {item.status === "ACTIVE" && (
          <Button
            mode="contained"
            style={styles.checkoutButton}
            onPress={() =>
              checkoutVisitor(item.id)
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

      {visitors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="titleMedium">
            No Active Visitors
          </Text>
        </View>
      ) : (
        <FlatList
          data={visitors}
          keyExtractor={(item) => item.id}
          renderItem={renderVisitor}
          contentContainerStyle={{
            paddingBottom: 20,
          }}
        />
      )}

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

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});