import React, { useState } from 'react';

import { View, StyleSheet } from 'react-native';

import { TextInput, Button, Text, Card } from 'react-native-paper';

import { router } from 'expo-router';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { loginUser } from '../services/supabaseService';

export default function LoginScreen() {
  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const user = await loginUser(username, password);

      if (!user) {
        alert('Invalid credentials');
        return;
      }

      await AsyncStorage.setItem('user', JSON.stringify(user));

      router.replace('/');
    } catch (error) {
      console.log(error);
      alert('Login failed');
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Card.Content>
          <Text variant='headlineSmall' style={styles.title}>
            Visitor Log Login
          </Text>

          <TextInput
            label='Username'
            value={username}
            onChangeText={setUsername}
            mode='outlined'
            style={styles.input}
          />

          <TextInput
            label='Password'
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            mode='outlined'
            style={styles.input}
          />

          <Button mode='contained' onPress={handleLogin}>
            Login
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },

  title: {
    textAlign: 'center',
    marginBottom: 20,
  },

  input: {
    marginBottom: 15,
  },
});
