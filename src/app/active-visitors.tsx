import React, { useEffect, useState } from 'react';

import { FlatList, Image, StyleSheet, View } from 'react-native';

import {
  Button,
  Card,
  Chip,
  Text,
  Divider,
  Avatar,
  Searchbar,
} from 'react-native-paper';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { getVisitors, checkoutVisitor } from '../services/supabaseService';

export default function ActiveVisitorsScreen() {
  const [visitors, setVisitors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchVisitors();
  }, []);

  const fetchVisitors = async () => {
    try {
      const data = await getVisitors();

      const activeVisitors = (data || []).filter(
        (v: any) => v.status === 'ACTIVE',
      );

      setVisitors(activeVisitors);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async (id: string) => {
    try {
      await checkoutVisitor(id);

      await fetchVisitors();
    } catch (error) {
      console.log(error);
    }
  };

  const filteredVisitors = visitors.filter((item) => {
    const query = searchQuery.toLowerCase();

    return (
      item.full_name?.toLowerCase().includes(query) ||
      item.mobile_no?.includes(query)
    );
  });

  const renderVisitor = ({ item }: { item: any }) => (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.cardHeader}>
          <View style={styles.profileSection}>
            {item.photo_url ? (
              <Image
                source={{
                  uri: item.photo_url,
                }}
                style={styles.image}
              />
            ) : (
              <Avatar.Icon size={60} icon='account' />
            )}

            <View style={styles.nameSection}>
              <Text variant='titleMedium'>{item.full_name}</Text>

              <Text style={styles.companyText}>{item.company_name}</Text>
            </View>
          </View>

          <Chip icon='account-check' mode='outlined'>
            ACTIVE
          </Chip>
        </View>

        <Divider
          style={{
            marginVertical: 12,
          }}
        />

        <Text>Designation: {item.designation}</Text>

        <Text>Mobile: {item.mobile_no}</Text>

        <Text>Purpose: {item.purpose}</Text>

        {item.host_name && <Text>Host: {item.host_name}</Text>}

        {item.vehicle_no && <Text>Vehicle: {item.vehicle_no}</Text>}

        <Text>
          Laptop Bag:
          {item.laptop_bag ? ' Yes' : ' No'}
        </Text>

        <Text>Logged By: {item.created_by_name}</Text>

        <Text>Username: {item.created_by}</Text>

        <Text>In Time: {new Date(item.in_time).toLocaleString()}</Text>

        {item.id_card_url && (
          <>
            <Divider
              style={{
                marginVertical: 10,
              }}
            />

            <Text
              style={{
                marginBottom: 8,
              }}
            >
              ID Card
            </Text>

            <Image
              source={{
                uri: item.id_card_url,
              }}
              style={styles.idImage}
            />
          </>
        )}

        <Button
          mode='contained'
          icon='logout'
          style={styles.checkoutBtn}
          onPress={() => handleCheckout(item.id)}
        >
          Check Out Visitor
        </Button>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.emptyState}>
        <Text>Loading visitors...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder='Search by Name or Mobile'
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
      />

      {filteredVisitors.length === 0 ? (
        <View style={styles.emptyState}>
          <MaterialCommunityIcons
            name='account-off-outline'
            size={80}
            color='#94A3B8'
          />

          <Text style={styles.emptyTitle}>No Active Visitors</Text>

          <Text style={styles.emptySubtitle}>
            Visitors currently inside the premises will appear here.
          </Text>
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
    marginBottom: 20,
  },

  card: {
    marginBottom: 15,
    borderRadius: 18,
    elevation: 3,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  profileSection: {
    flexDirection: 'row',
    flex: 1,
  },

  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E7EB',
  },

  nameSection: {
    marginLeft: 12,
    flex: 1,
  },

  companyText: {
    color: '#64748B',
  },

  idImage: {
    width: '100%',
    height: 150,
    borderRadius: 12,
  },

  checkoutBtn: {
    marginTop: 20,
    borderRadius: 12,
  },

  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 80,
  },

  emptyTitle: {
    marginTop: 15,
    fontSize: 20,
    fontWeight: '600',
  },

  emptySubtitle: {
    marginTop: 10,
    color: '#64748B',
    textAlign: 'center',
  },
});
