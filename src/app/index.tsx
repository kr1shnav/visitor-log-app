import React, { useState, useEffect } from 'react';

import { View, StyleSheet } from 'react-native';

import { Button, Text, Card } from 'react-native-paper';

import { router } from 'expo-router';

import { getVisitors, getEquipmentLogs } from '../services/supabaseService';

import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [activeVisitors, setActiveVisitors] = useState(0);

  const [user, setUser] = useState<any>(null);

  const [todaysVisitors, setTodaysVisitors] = useState(0);

  const [checkedOutToday, setCheckedOutToday] = useState(0);

  const [equipmentOut, setEquipmentOut] = useState(0);

  const logout = async () => {
    await AsyncStorage.removeItem('user');

    router.replace('/login');

    <Button mode='outlined' style={styles.button} onPress={logout}>
      Logout
    </Button>;
  };

  const checkLogin = async () => {
    const storedUser = await AsyncStorage.getItem('user');

    if (!storedUser) {
      router.replace('/login');
      return;
    }

    setUser(JSON.parse(storedUser));
  };

  useEffect(() => {
    checkLogin();
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const visitors = await getVisitors();

      const equipment = await getEquipmentLogs();

      const today = new Date();

      const active = visitors.filter((v: any) => v.status === 'ACTIVE').length;

      const todayCount = visitors.filter((v: any) => {
        const created = new Date(v.created_at);

        return (
          created.getDate() === today.getDate() &&
          created.getMonth() === today.getMonth() &&
          created.getFullYear() === today.getFullYear()
        );
      }).length;

      const checkedOut = visitors.filter((v: any) => {
        if (v.status !== 'CHECKED_OUT' || !v.out_time) {
          return false;
        }

        const outDate = new Date(v.out_time);

        return (
          outDate.getDate() === today.getDate() &&
          outDate.getMonth() === today.getMonth() &&
          outDate.getFullYear() === today.getFullYear()
        );
      }).length;

      const equipmentCount = equipment.filter(
        (e: any) => e.status === 'OUT',
      ).length;

      console.log({
        active,
        todayCount,
        checkedOut,
        equipmentCount,
      });

      setActiveVisitors(active);
      setTodaysVisitors(todayCount);
      setCheckedOutToday(checkedOut);
      setEquipmentOut(equipmentCount);
    } catch (error) {
      console.log('Dashboard Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant='headlineMedium' style={styles.title}>
        Visitor Log System
      </Text>

      <View style={styles.dashboardRow}>
        <Card style={styles.dashboardCard}>
          <Card.Content>
            <Text>Active Visitors</Text>

            <Text variant='headlineSmall'>{activeVisitors}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.dashboardCard}>
          <Card.Content>
            <Text>Today's Visitors</Text>

            <Text variant='headlineSmall'>{todaysVisitors}</Text>
          </Card.Content>
        </Card>
      </View>

      <View style={styles.dashboardRow}>
        <Card style={styles.dashboardCard}>
          <Card.Content>
            <Text>Checked Out Today</Text>

            <Text variant='headlineSmall'>{checkedOutToday}</Text>
          </Card.Content>
        </Card>

        <Card style={styles.dashboardCard}>
          <Card.Content>
            <Text>Equipment Out</Text>

            <Text variant='headlineSmall'>{equipmentOut}</Text>
          </Card.Content>
        </Card>
      </View>

      <Button mode='outlined' style={styles.button} onPress={fetchDashboard}>
        Refresh Dashboard
      </Button>

      <Button
        mode='contained'
        style={styles.button}
        onPress={() => router.push('/new-visitor')}
      >
        New Visitor
      </Button>

      <Button
        mode='contained'
        style={styles.button}
        onPress={() => router.push('/active-visitors')}
      >
        Active Visitors
      </Button>

      <Button
        mode='contained'
        style={styles.button}
        onPress={() => router.push('/history')}
      >
        Visitor Records
      </Button>

      <Button
        mode='contained'
        style={styles.button}
        onPress={() => router.push('/equipment-entry')}
      >
        Equipment Register
      </Button>

      <Button
        mode='contained'
        style={styles.button}
        onPress={() => router.push('/equipment-records')}
      >
        Equipment Records
      </Button>

      {user?.role === 'ADMIN' && (
        <Button
          mode='contained'
          style={styles.button}
          onPress={() => router.push('/user-management')}
        >
          User Management
        </Button>
      )}

      <Button mode='outlined' onPress={logout}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  dashboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  dashboardCard: {
    width: '48%',
  },

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#e5f2fe',
  },

  title: {
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },

  button: {
    marginBottom: 12,
  },
});
