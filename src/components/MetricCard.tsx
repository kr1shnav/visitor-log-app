import React from 'react';

import { View, StyleSheet } from 'react-native';

import { Card, Text } from 'react-native-paper';

import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import {
  COLORS,
  SHADOW,
} from '../constants/theme';

interface Props {
  icon: any;
  color: string;
  label: string;
  value: number;
}

export default function MetricCard({
  icon,
  color,
  label,
  value,
}: Props) {
  return (
    <Card style={styles.card}>
      <View
        style={[
          styles.accent,
          {
            backgroundColor: color,
          },
        ]}
      />

      <Card.Content>
        <MaterialCommunityIcons
          name={icon}
          size={28}
          color={color}
        />

        <Text style={styles.label}>
          {label}
        </Text>

        <Text style={styles.value}>
          {value}
        </Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    width: '48%',

    borderRadius: 18,

    backgroundColor:
      COLORS.surface,

    ...SHADOW,
  },

  accent: {
    height: 6,

    borderTopLeftRadius: 18,

    borderTopRightRadius: 18,
  },

  label: {
    marginTop: 10,

    color: COLORS.textMuted,

    fontSize: 13,
  },

  value: {
    marginTop: 5,

    fontSize: 28,

    fontWeight: '700',

    color: COLORS.text,
  },
});