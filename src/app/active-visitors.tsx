import { useState } from 'react';

import { FlatList, Image, StyleSheet, View } from 'react-native';

import { Button, Card, Chip, Text, TextInput } from 'react-native-paper';

import { useVisitor } from '../context/VisitorContext';

export default function ActiveVisitorsScreen() {
  const { visitors, checkoutVisitor } = useVisitor();

  const [search, setSearch] = useState('');

  const filteredVisitors = visitors.filter((visitor) => {
    const searchText = search.toLowerCase();

    return (
      visitor.fullName.toLowerCase().includes(searchText) ||
      visitor.mobileNo.includes(searchText)
    );
  });

  const renderVisitor = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.row}>
          <View>
            <Image
              source={{
                uri: item.image || 'https://via.placeholder.com/150',
              }}
              style={styles.image}
            />

            {item.idCardImage && (
              <Image
                source={{
                  uri: item.idCardImage,
                }}
                style={styles.idImage}
              />
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text variant='titleMedium'>{item.fullName}</Text>

            <Text>Company: {item.companyName}</Text>

            <Text>Designation: {item.designation}</Text>

            <Text>Mobile: {item.mobileNo}</Text>

            <Text>Vehicle: {item.vehicleNo}</Text>

            <Text>Purpose: {item.purpose}</Text>

            <Text>In Time: {item.inTime}</Text>

            {item.outTime && <Text>Out Time: {item.outTime}</Text>}

            <Text>
              ID Card: {item.idCardImage ? 'Available' : 'Not Provided'}
            </Text>

            <Chip
              style={
                item.status === 'ACTIVE'
                  ? styles.activeChip
                  : styles.checkoutChip
              }
            >
              {item.status}
            </Chip>
          </View>
        </View>

        {item.status === 'ACTIVE' && (
          <Button
            mode='contained'
            style={styles.checkoutButton}
            onPress={() => checkoutVisitor(item.id)}
          >
            CHECK OUT
          </Button>
        )}
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <TextInput
        mode='outlined'
        label='Search by Name or Mobile'
        value={search}
        onChangeText={setSearch}
        style={styles.searchBar}
      />

      {filteredVisitors.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant='titleMedium'>No Visitors Found</Text>
        </View>
      ) : (
        <FlatList
          data={filteredVisitors}
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
    backgroundColor: '#F8FAFC',
  },

  searchBar: {
    marginBottom: 16,
  },

  card: {
    marginBottom: 16,
    borderRadius: 12,
  },

  row: {
    flexDirection: 'row',
  },

  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },

  idImage: {
    width: 80,
    height: 50,
    borderRadius: 6,
    marginTop: 8,
  },
  
  infoContainer: {
    flex: 1,
  },

  activeChip: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },

  checkoutChip: {
    marginTop: 10,
    alignSelf: 'flex-start',
  },

  checkoutButton: {
    marginTop: 20,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
