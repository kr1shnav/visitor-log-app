import React from 'react';

import { TouchableOpacity, StyleSheet } from 'react-native';

import { Card, Text } from 'react-native-paper';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import { router } from 'expo-router';

import { COLORS, SHADOW } from '../constants/theme';

interface Props {
  icon: any;
  label: string;
  route: any;
}

export default function NavTile({ icon, label, route }: Props) {
  return (
    <TouchableOpacity onPress={() => router.push(route)} style={styles.wrapper}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <MaterialCommunityIcons
            name={icon}
            size={32}
            color={COLORS.primary}
          />

          <Text style={styles.label}>{label}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '48%',
  },

  card: {
    borderRadius: 18,

    backgroundColor: COLORS.surface,

    borderWidth: 1,

    borderColor: COLORS.border,

    ...SHADOW,
  },

  content: {
    alignItems: 'center',

    justifyContent: 'center',

    height: 100,
  },

  label: {
    marginTop: 10,

    textAlign: 'center',

    fontSize: 13,
  },
});
