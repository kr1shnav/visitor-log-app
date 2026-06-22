import React, { useState, useCallback, useEffect } from 'react';

import { View, StyleSheet, ScrollView } from 'react-native';

import { Button, Text } from 'react-native-paper';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { router } from 'expo-router';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { getVisitors, getEquipmentLogs } from '../services/supabaseService';

import MetricCard from '../components/MetricCard';

import NavTile from '../components/NavTile';

import { COLORS } from '../constants/theme';

export default function HomeScreen() {
  const [activeVisitors, setActiveVisitors] = useState(0);

  const [todaysVisitors, setTodaysVisitors] = useState(0);

  const [checkedOutToday, setCheckedOutToday] = useState(0);

  const [equipmentOut, setEquipmentOut] = useState(0);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    fetchDashboard();
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const storedUser = await AsyncStorage.getItem('user');

    if (!storedUser) {
      router.replace('/login' as any);
      return;
    }

    setUser(JSON.parse(storedUser));
  };

  const fetchDashboard = async () => {
    try {
      const visitors = await getVisitors();

      const equipment = await getEquipmentLogs();

      const today = new Date().toISOString().split('T')[0];

      const active = visitors.filter((v: any) => v.status === 'ACTIVE').length;

      const todayCount = visitors.filter(
        (v: any) => v.created_at?.split('T')[0] === today,
      ).length;

      const checkedOut = visitors.filter(
        (v: any) =>
          v.status === 'CHECKED_OUT' && v.out_time?.split('T')[0] === today,
      ).length;

      const equipmentCount = equipment.filter(
        (e: any) => e.status === 'OUT',
      ).length;

      setActiveVisitors(active);

      setTodaysVisitors(todayCount);

      setCheckedOutToday(checkedOut);

      setEquipmentOut(equipmentCount);
    } catch (error) {
      console.log(error);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('user');

    router.replace('/login' as any);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name='shield-account'
          size={34}
          color={COLORS.primary}
        />

        <View>
          <Text style={styles.headerTitle}>Visitor Log System</Text>

          {user && (
            <Text style={styles.userText}>Welcome, {user.full_name}</Text>
          )}
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <MetricCard
          icon='account-group-outline'
          color='#2563EB'
          label='Active Visitors'
          value={activeVisitors}
        />

        <MetricCard
          icon='calendar-today'
          color='#059669'
          label="Today's Visitors"
          value={todaysVisitors}
        />

        <MetricCard
          icon='logout'
          color='#D97706'
          label='Checked Out'
          value={checkedOutToday}
        />

        <MetricCard
          icon='laptop'
          color='#7C3AED'
          label='Equipment Out'
          value={equipmentOut}
        />
      </View>

      <View style={styles.grid}>
        <NavTile
          icon='account-plus-outline'
          label='New Visitor'
          route='/new-visitor'
        />

        <NavTile
          icon='account-clock-outline'
          label='Active'
          route='/active-visitors'
        />

        <NavTile icon='history' label='Records' route='/history' />

        <NavTile
          icon='laptop-account'
          label='Equipment'
          route='/equipment-entry'
        />

        <NavTile
          icon='clipboard-list-outline'
          label='Equip Logs'
          route='/equipment-records'
        />

        {user?.role === 'ADMIN' && (
          <NavTile
            icon='account-cog-outline'
            label='Users'
            route='/user-management'
          />
        )}
      </View>

      <View style={styles.footerActions}>
        <Button mode='text' onPress={fetchDashboard}>
          Refresh Dashboard
        </Button>

        <Button mode='text' onPress={logout} textColor='red'>
          Logout
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: COLORS.background,

    padding: 16,
  },

  header: {
    flexDirection: 'row',

    alignItems: 'center',

    marginTop: 20,

    marginBottom: 30,
  },

  headerTitle: {
    fontSize: 24,

    fontWeight: '700',

    color: COLORS.text,

    marginLeft: 12,
  },

  userText: {
    marginLeft: 12,

    color: COLORS.textMuted,

    marginTop: 4,
  },

  metricsGrid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    gap: 14,

    marginBottom: 30,
  },

  grid: {
    flexDirection: 'row',

    flexWrap: 'wrap',

    justifyContent: 'space-between',

    gap: 14,
  },

  footerActions: {
    marginTop: 25,

    flexDirection: 'row',

    justifyContent: 'space-between',
  },
});
