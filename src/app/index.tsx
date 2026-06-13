import React, { useEffect, useState } from 'react';

import { View, StyleSheet } from 'react-native';

import { Button, Text, Card } from 'react-native-paper';

import { router } from 'expo-router';

import { getVisitors } from '../services/supabaseService';

export default function HomeScreen() {
  const [stats, setStats] = useState({
    totalToday: 0,
    active: 0,
    checkedOut: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const data = await getVisitors();

      const today = new Date()
        .toISOString()
        .split('T')[0];

      const totalToday = data.filter(
        (visitor: any) =>
          visitor.created_at?.split('T')[0] === today,
      ).length;

      const active = data.filter(
        (visitor: any) => visitor.status === 'ACTIVE',
      ).length;

      const checkedOut = data.filter(
        (visitor: any) =>
          visitor.status === 'CHECKED_OUT',
      ).length;

      setStats({
        totalToday,
        active,
        checkedOut,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text
        variant='headlineMedium'
        style={styles.title}
      >
        Visitor Log System
      </Text>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant='titleMedium'>
            Today's Visitors
          </Text>

          <Text style={styles.statNumber}>
            {stats.totalToday}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant='titleMedium'>
            Active Visitors
          </Text>

          <Text style={styles.statNumber}>
            {stats.active}
          </Text>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant='titleMedium'>
            Checked Out
          </Text>

          <Text style={styles.statNumber}>
            {stats.checkedOut}
          </Text>
        </Card.Content>
      </Card>

      <Button
        mode='contained'
        style={styles.button}
        onPress={() =>
          router.push('/new-visitor')
        }
      >
        New Visitor
      </Button>

      <Button
        mode='contained'
        style={styles.button}
        onPress={() =>
          router.push('/active-visitors')
        }
      >
        Active Visitors
      </Button>

      <Button
        mode='contained'
        style={styles.button}
        onPress={() =>
          router.push('/history')
        }
      >
        Visitor Records
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F8FAFC',
  },

  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  card: {
    marginBottom: 12,
    borderRadius: 12,
  },

  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 5,
  },

  button: {
    marginTop: 10,
    paddingVertical: 5,
  },
});