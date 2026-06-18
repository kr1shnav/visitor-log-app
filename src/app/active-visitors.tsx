import React, { useEffect, useState } from 'react';

import { FlatList, Image, StyleSheet, View } from 'react-native';

import { Button, Card, Chip, Text, TextInput } from 'react-native-paper';

import { getVisitors, checkoutVisitor } from '../services/supabaseService';

export default function ActiveVisitorsScreen() {
  const [visitors, setVisitors] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchVisitors();
  }, []);
  const handleCheckout = async (id: string) => {
    try {
      await checkoutVisitor(id);

      await fetchVisitors();
    } catch (error) {
      console.log(error);
    }
  };
  const fetchVisitors = async () => {
    try {
      const data = await getVisitors();

      console.log('VISITORS DATA:', data);

      setVisitors(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const filteredVisitors = visitors.filter((visitor) => {
    const searchText = search.toLowerCase();

    return (
      visitor.full_name?.toLowerCase().includes(searchText) ||
      visitor.mobile_no?.includes(searchText)
    );
  });

  const renderVisitor = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.row}>
          <View>
            <Image
              source={{
                uri: item.photo_url,
              }}
              style={styles.image}
              resizeMode='cover'
            />

            {item.id_card_url && (
              <Image
                source={{
                  uri: item.id_card_url,
                }}
                style={styles.idImage}
                resizeMode='cover'
              />
            )}
          </View>

          <View style={styles.infoContainer}>
            <Text variant='titleMedium'>{item.full_name}</Text>

            <Text>Company: {item.company_name}</Text>

            {item.host_name && <Text>Host: {item.host_name}</Text>}

            <Text>Designation: {item.designation}</Text>

            <Text>Mobile: {item.mobile_no}</Text>

            <Text>Vehicle: {item.vehicle_no}</Text>

            <Text>Laptop Bag: {item.laptop_bag ? 'Yes' : 'No'}</Text>

            <Text>Purpose: {item.purpose}</Text>

            <Text>Status: {item.status}</Text>

            <Text>In Time: {new Date(item.in_time).toLocaleString()}</Text>

            {item.out_time && (
              <Text>Out Time: {new Date(item.out_time).toLocaleString()}</Text>
            )}

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
            onPress={() => handleCheckout(item.id)}
          >
            CHECK OUT
          </Button>
        )}
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.emptyContainer}>
        <Text>Loading visitors...</Text>
      </View>
    );
  }

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
    alignItems: 'flex-start',
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginRight: 15,
    backgroundColor: '#E5E7EB',
  },

  idImage: {
    width: 90,
    height: 55,
    borderRadius: 6,
    marginTop: 8,
    backgroundColor: '#E5E7EB',
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
